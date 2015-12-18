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
	        var close = confirm('אין חיבור לאינטרנט. האם ברצונך לצאת מהאפליקציה?');
	        if (close) {
	            navigator.app.exitApp();
	        }
	    },
	    success: function (data) {
	        //alert('data:\n' + JSON.stringify(data));
	       
	        storeInPhone(data, category, id);
	       
	    }
	});
}
