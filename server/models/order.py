from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean, Text, Numeric, ForeignKey, Enum, func, JSON
from sqlalchemy.orm import relationship, validates
from datetime import datetime
import re

# Order status constants
ORDER_STATUS = ('pending', 'processing', 'on_hold', 'shipped', 'delivered', 'cancelled', 'refunded')
PAYMENT_STATUS = ('pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded')
PAYMENT_METHODS = ('mpesa', 'cash',)
SHIPPING_METHODS = ('standard', 'express', 'overnight', 'international')

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    
    # Primary Key
    id = Column(Integer, primary_key=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    
    # Order Status
    status = Column(Enum(*ORDER_STATUS, name='order_status'), default='pending', nullable=False)
    payment_status = Column(Enum(*PAYMENT_STATUS, name='payment_status'), default='pending', nullable=False)
    
    # Pricing and Totals
    subtotal = Column(Numeric(10, 2), nullable=False, default=0)
    tax_amount = Column(Numeric(10, 2), nullable=False, default=0)
    shipping_amount = Column(Numeric(10, 2), nullable=False, default=0)
    discount_amount = Column(Numeric(10, 2), nullable=False, default=0)
    total_amount = Column(Numeric(10, 2), nullable=False, default=0)
    currency = Column(String(3), nullable=False, default='KES')
    
    # Payment Information
    payment_method = Column(Enum(*PAYMENT_METHODS, name='payment_methods'))
    payment_id = Column(String(100))
    transaction_id = Column(String(100)) 
    payment_date = Column(DateTime)
    
    # Shipping Information
    shipping_method = Column(Enum(*SHIPPING_METHODS, name='shipping_methods'), default='standard')
    tracking_number = Column(String(100))
    shipping_carrier = Column(String(50))
    estimated_delivery = Column(DateTime)
    
    # Customer Notes
    customer_note = Column(Text)
    admin_note = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now())
    completed_at = Column(DateTime)
    
    # Relationships
    user = relationship('User', back_populates='orders')
    items = relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
    shipping_address = relationship('Address', foreign_keys='Order.shipping_address_id')
    billing_address = relationship('Address', foreign_keys='Order.billing_address_id')
    payments = relationship('Payment', back_populates='order')
    
    # Foreign Keys for addresses (storing snapshot at time of order)
    shipping_address_id = Column(Integer, ForeignKey('addresses.id'), nullable=False)
    billing_address_id = Column(Integer, ForeignKey('addresses.id'), nullable=False)
    
    # Serialization rules
    serialize_rules = (
        '-user.orders',
        '-items.order',
        '-payments.order',
        '-shipping_address.orders_shipping',
        '-billing_address.orders_billing',
    )
    
    def __repr__(self):
        return f"<Order {self.order_number}: ${self.total_amount} - {self.status}>"
    
    # Generate order number
    @classmethod
    def generate_order_number(cls):
        """Generate unique order number (e.g., ORD-20240115-0001)"""
        from datetime import datetime
        today = datetime.now()
        date_str = today.strftime('%Y%m%d')
        
        # Find the last order today and increment
        last_order = cls.query.filter(
            cls.order_number.like(f'ORD-{date_str}-%')
        ).order_by(cls.order_number.desc()).first()
        
        if last_order:
            last_num = int(last_order.order_number.split('-')[-1])
            new_num = f"{last_num + 1:04d}"
        else:
            new_num = "0001"
        
        return f"ORD-{date_str}-{new_num}"
    
    # Calculate totals
    def calculate_totals(self):
        """Calculate order totals from items"""
        self.subtotal = sum(item.total_price for item in self.items)
        
        # Apply discount if any
        if self.discount_amount > self.subtotal:
            self.discount_amount = self.subtotal
            
        # Calculate tax (simplified - in reality, you'd use tax service)
        self.tax_amount = round(self.subtotal * 0.08, 2)  # 8% tax example
        
        self.total_amount = self.subtotal + self.tax_amount + self.shipping_amount - self.discount_amount
        
        # Ensure non-negative total
        if self.total_amount < 0:
            self.total_amount = 0
    
    # Update stock
    def update_inventory(self, action='reduce'):
        """Update inventory when order status changes"""
        for item in self.items:
            if action == 'reduce':
                item.book.increment_sales(item.quantity, item.unit_price)
            elif action == 'restore':  # For cancellations/refunds
                item.book.stock_quantity += item.quantity
                item.book.total_sold = max(0, item.book.total_sold - item.quantity)
    
    # Check if order can be cancelled
    def can_cancel(self):
        """Check if order can be cancelled"""
        non_cancellable_statuses = ['shipped', 'delivered', 'refunded']
        return self.status not in non_cancellable_statuses
    
    # Get order summary
    def get_summary(self):
        """Get order summary for display"""
        return {
            'order_number': self.order_number,
            'status': self.status,
            'total': float(self.total_amount),
            'item_count': len(self.items),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class OrderItem(db.Model, SerializerMixin):
    __tablename__ = 'order_items'
    
    # Primary Key
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False, index=True)
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False, index=True)
    
    # Item Details (snapshot at time of purchase)
    book_title = Column(String(255), nullable=False)  # Snapshot of title
    book_author = Column(String(150), nullable=False)  # Snapshot of author
    isbn = Column(String(13))  # Snapshot of ISBN
    cover_image = Column(String(500))  # Snapshot of cover image
    
    # Pricing
    unit_price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    total_price = Column(Numeric(10, 2), nullable=False)  # unit_price * quantity
    discount_applied = Column(Numeric(10, 2), default=0)
    
    # Metadata
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now())
    # Relationships
    order = relationship('Order', back_populates='items')
    book = relationship('Book', back_populates='order_items')
    
    # Serialization rules
    serialize_rules = ('-order.items', '-book.order_items',)
    
    def __repr__(self):
        return f"<OrderItem {self.id}: {self.book_title} x{self.quantity}>"
    
    # Validation
    @validates('quantity')
    def validate_quantity(self, key, quantity):
        if quantity <= 0:
            raise ValueError("Quantity must be at least 1")
        return quantity
    
    # Calculate total
    def calculate_total(self):
        """Calculate total price for this item"""
        self.total_price = self.unit_price * self.quantity - self.discount_applied
        if self.total_price < 0:
            self.total_price = 0
        return self.total_price


class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'
    
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False, index=True)
    payment_number = Column(String(50), unique=True, nullable=False)  # e.g., PAY-20241226-0001
    
    # Payment Details
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), nullable=False, default='KES')  # Kenyan Shilling
    method = Column(String(20), default='mpesa_stk_push', nullable=False)  # Method is now M-Pesa
    status = Column(Enum(*PAYMENT_STATUS, name='payment_status'), default='pending', nullable=False)
    
    # M-Pesa Specific Fields
    customer_phone = Column(String(15), nullable=False)  # Format: 2547XXXXXXXX[citation:2]
    merchant_request_id = Column(String(50))  # From Safaricom initial response[citation:1]
    checkout_request_id = Column(String(50), unique=True, index=True)  # For querying status[citation:1]
    mpesa_receipt_number = Column(String(50))  # Confirmation code from successful payment
    result_code = Column(Integer)  # 0 = success, other = error[citation:1]
    result_description = Column(String(255))  # Description from M-Pesa callback
    
    # Gateway Response (Store raw API responses for debugging)
    stk_push_response = Column(JSON)  # Response from initiating STK Push
    callback_payload = Column(JSON)   # Full callback data from M-Pesa
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now())
    initiated_at = Column(DateTime)   # When STK Push was sent
    completed_at = Column(DateTime)   # When callback confirmed success/failure
    
    # Relationships
    order = relationship('Order', back_populates='payments')
    
    serialize_rules = ('-order.payments', '-stk_push_response', '-callback_payload')
    
    def __repr__(self):
        return f"<Payment {self.payment_number}: KES {self.amount} - {self.status}>"
    
    @classmethod
    def generate_payment_number(cls):
        """Generate unique payment number"""
        from datetime import datetime
        date_str = datetime.now().strftime('%Y%m%d')
        last_payment = cls.query.filter(
            cls.payment_number.like(f'PAY-{date_str}-%')
        ).order_by(cls.payment_number.desc()).first()
        
        if last_payment:
            last_num = int(last_payment.payment_number.split('-')[-1])
            new_num = f"{last_num + 1:04d}"
        else:
            new_num = "0001"
        
        return f"PAY-{date_str}-{new_num}"
    
    def update_from_callback(self, callback_data):
        """Update payment status from M-Pesa callback"""
        # Extract data from callback (structure varies)
        callback_body = callback_data.get('Body', {}).get('stkCallback', {})
        self.result_code = callback_body.get('ResultCode')
        self.result_description = callback_body.get('ResultDesc')
        self.callback_payload = callback_data
        
        if self.result_code == 0:
            # Payment successful
            item = callback_body.get('CallbackMetadata', {}).get('Item', [])
            for meta_item in item:
                if meta_item.get('Name') == 'MpesaReceiptNumber':
                    self.mpesa_receipt_number = meta_item.get('Value')
                if meta_item.get('Name') == 'PhoneNumber':
                    self.customer_phone = meta_item.get('Value')
            self.status = 'paid'
            self.completed_at = datetime.utcnow()
            
            # Update related order status
            self.order.payment_status = 'paid'
            if self.order.status == 'pending':
                self.order.status = 'processing'
        else:
            # Payment failed
            self.status = 'failed'
            self.completed_at = datetime.utcnow()
            self.order.payment_status = 'failed'