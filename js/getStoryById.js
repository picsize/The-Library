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
	        var onConfirm = function (buttonIndex) {
	            alert(JSON.stringify(buttonIndex));
	        }
	        navigator.notification.confirm('אין חיבור לאינטרנט. האם ברצונך לצאת מהאפליקציה?', onConfirm, 'הספריה', ['כן', 'לא']);
	    },
	    success: function (data) {
	        //alert('data:\n' + JSON.stringify(data));
	       
	        storeInPhone(data, category, id);
	       
	    }
	});
}
