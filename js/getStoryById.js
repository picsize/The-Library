function getStoryById(id, category) {

    $.ajax(
	{
	    type: 'POST',
	    url: 'http://www.kidnet.co.il/books/server/server.php',
	    dataType: 'json',
	    data: { request: 30, id: id, cat: category },
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	        alert(textStatus);
	        alert(JSON.stringify(XMLHttpRequest));
	        alert(JSON.stringify(errorThrown));
	    },
	    success: function (data) {
	        storyData = data;
	        //alert(data.time[2][1]);
	        setStory(data);
	    }
	});
}
