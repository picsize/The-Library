function getStories(category) {
    $.ajax(
	{
	    type: 'POST',
	    url: 'http://www.kidnet.co.il/books/server/server.php',
	    dataType: 'json',
	    data: { request: 15, cat: category },
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	        var close = confirm("��� ����� ��������. ��� ������ ���� ����������?");
	        if (close) {
	            navigator.app.exitApp();
	        }
	    },
	    success: function (data) {
	        setFirstStory(data);
	    }
	});
}