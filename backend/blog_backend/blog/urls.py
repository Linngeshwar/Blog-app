from django.urls import path,include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import BlogPostViewSet,UserRegistrationView,UserDetailView,CustomTokenObtainPairView,TagViewSet

router = DefaultRouter()
router.register(r'posts',BlogPostViewSet)
router.register(r'users',UserDetailView)
router.register(r'tags',TagViewSet)


urlpatterns = [
    path('api/',include(router.urls)),
    path('api/register/',UserRegistrationView.as_view(),name='register'),
    path('api/token/',CustomTokenObtainPairView.as_view(),name='token_obtain_pair')
]