from server.controllers.auth import Login, Logout, Register
from server.controllers.books import (
    AdminBookListResource, AdminBookResource,
    BookListResource, BookResource, FeaturedBooksResource,
    BestsellerBooksResource, CategoryListResource, SearchBooksResource
)# Import controllers
from server.controllers.cart import CartResource, CartItemResource, CartByID
from server.controllers.orders import OrderListResource, OrderResource
from server.controllers.reviews import BookReviewsResource, ReviewResource, ReviewHelpfulResource
from server.controllers.admin import (
    AdminDashboardStatsResource, AdminUsersResource, AdminUserResource,
    AdminOrdersResource, AdminOrderStatusResource, AdminReviewsResource,
    AdminReviewResource
)
from server.controllers.wishlist import WishlistResource, WishlistItemResource, WishlistMoveToCartResource

# Register routes


def addResource(api):
    api.add_resource(Login, "/api/login")
    api.add_resource(Logout, "/api/logout")
    api.add_resource(Register, "/api/register")
    api.add_resource(BookListResource, '/api/books')
    api.add_resource(BookResource, '/api/books/<int:id>')
    api.add_resource(FeaturedBooksResource, '/api/books/featured')
    api.add_resource(BestsellerBooksResource, '/api/books/bestsellers')
    api.add_resource(CategoryListResource, '/api/categories')
    api.add_resource(SearchBooksResource, '/api/books/search')
    api.add_resource(CartResource, '/api/cart')
    api.add_resource(CartItemResource, '/api/cart/items')
    api.add_resource(CartByID, '/api/cart/items/<int:item_id>')
    api.add_resource(OrderListResource, '/api/orders')
    api.add_resource(OrderResource, '/api/orders/<int:order_id>')
    api.add_resource(BookReviewsResource, '/api/books/<int:book_id>/reviews')
    api.add_resource(ReviewResource, '/api/reviews/<int:review_id>')
    api.add_resource(ReviewHelpfulResource, '/api/reviews/<int:review_id>/<string:action>')
    api.add_resource(WishlistResource, '/api/wishlist')
    api.add_resource(WishlistItemResource, '/api/wishlist/items', '/api/wishlist/items/<int:item_id>')
    api.add_resource(WishlistMoveToCartResource, '/api/wishlist/items/<int:item_id>/move-to-cart')

    # Admin API routes (require authentication)
    api.add_resource(AdminBookListResource, '/api/admin/books')
    api.add_resource(AdminBookResource, '/api/admin/books/<int:id>')
    api.add_resource(AdminDashboardStatsResource, '/api/admin/dashboard/stats')
    api.add_resource(AdminUsersResource, '/api/admin/users')
    api.add_resource(AdminUserResource, '/api/admin/users/<int:user_id>')
    api.add_resource(AdminOrdersResource, '/api/admin/orders')
    api.add_resource(AdminOrderStatusResource, '/api/admin/orders/<int:order_id>/status')
    api.add_resource(AdminReviewsResource, '/api/admin/reviews')
    api.add_resource(AdminReviewResource, '/api/admin/reviews/<int:review_id>')