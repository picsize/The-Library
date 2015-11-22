function getStoryById(id, category) {
    var dm = new DirManager(); // Initialize a Folder manager
    dm.create_r('TheLibrary/' + category + '/story' + id, Log('created successfully'));

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
	        //alert('data:\n' + JSON.stringify(data));
	       
	        storeInPhone(data, category, id);
	        //storyData = data;
	        //setStory(data);
	    }
	});
}
