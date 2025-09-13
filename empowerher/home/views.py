from django.shortcuts import render

# Create your views here.
def index(request):
    """
    Renders the homepage of the website.
    """
    return render(request, 'home/index.html')
