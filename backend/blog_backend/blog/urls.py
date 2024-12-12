from django.urls import path,include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import BlogPostViewSet,UserRegistrationView,UserDetailView,CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'posts',BlogPostViewSet)
router.register(r'users',UserDetailView)

urlpatterns = [
    path('api/',include(router.urls)),
    path('api/register/',UserRegistrationView.as_view(),name='register'),
    path('api/token/',TokenObtainPairView.as_view(),name='token_obtain_pair')
]