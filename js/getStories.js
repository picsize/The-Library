function getStories(category) {
    $.ajax(
	{
	    type: 'POST',
	    url: 'http://www.kidnet.co.il/books/server/server.php',
	    dataType: 'json',
	    data: { request: 15, cat: category },
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	        alert(textStatus);
	        alert(JSON.stringify(XMLHttpRequest));
	        alert(JSON.stringify(errorThrown));
	    },
	    success: function (data) {
	        setFirstStory(data);
	    }
	});
}