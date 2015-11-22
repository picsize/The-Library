function getStoryById(id, category) {
    localStorage.setItem('folderName', category);
    $.ajax(
	{
	    type: 'POST',
	    url: 'http://www.kidnet.co.il/books/server/server.php',
	    dataType: 'json',
	    data: { request: 31, id: id, cat: category },
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	        alert(textStatus);
	        alert(JSON.stringify(XMLHttpRequest));
	        alert(JSON.stringify(errorThrown));
	    },
	    success: function (data) {
	        alert('data:\n' + JSON.stringify(data));
	       
	        storeInPhone(data);
	        storyData = data;
	        //alert(data.time[2][1]);
	        setStory(data);
	    }
	});
}
