$(document).ready(function() {
    var pathname = window.location.pathname;
    $('.sidebar > li > a[href="'+pathname+'"]').addClass('active');
});