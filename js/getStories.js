function getStories(category) {
    $.ajax(
	{
	    type: 'POST',
	    url: 'http://www.kidnet.co.il/books/server/server.php',
	    dataType: 'json',
	    data: { request: 15, cat: category },
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	        var onConfirm = function (buttonIndex) {
	            alert(JSON.stringify(buttonIndex));
	        }
	        navigator.notification.confirm('��� ����� ��������. ��� ������ ���� ����������?', onConfirm, '������', ['��', '��']);
	    },
	    success: function (data) {
	        setFirstStory(data);
	    }
	});
}