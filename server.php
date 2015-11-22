<?PHP
$request = $_POST['request'];
switch ($request)
{
	case 15:
		$cat = $_POST['cat'];
		echo getStories($cat);
		break;
	case 30:
		$cat = $_POST['cat'];
		$id = $_POST['id'];
		echo getStoryById($id, $cat);
		break;	
}
function getURLOptions ($file_to_open)
{
	$urlData = array();
	$x 		 = array();
	$y 	     = array();
	$height  = array();
	$width   = array();
	$k 		 = array();
	$b 		 = array();
	
	$file = fopen($file_to_open, "r");
	while(!feof($file))
	{
		$line = fgets($file);
		$read_line = explode('x=', $line);
		$read_line = explode('&y=', $read_line[1]);
			array_push($x,$read_line[0]);
		$read_line = explode('&height=', $read_line[1]);
			array_push($y,$read_line[0]);
		$read_line = explode('&width=', $read_line[1]);
			array_push($height,$read_line[0]);
		$read_line = explode('&k=', $read_line[1]);
			array_push($width,$read_line[0]);			
		$read_line = explode('&b=', $read_line[1]);
			array_push($k,$read_line[0]);				
		$read_line = explode(';', $read_line[1]);
			array_push($b,$read_line[0]);			
	}
	$urlData['x'] = $x;
	$urlData['y'] = $y;
	$urlData['height'] = $height;
	$urlData['width'] = $width;
	$urlData['k'] = $k;
	$urlData['b'] = $b;
	
	return $urlData;
}
function getStories ($cat)
{
	$dir = 'stories/'.$cat;
	$files = scandir($dir, 1);
	
	return json_encode(count($files)-2);
}

function getLocationFromFile ($file_to_open)
{
	$locationX = array();
	$locationY = array();
	$location  = array();	
	
	$file = fopen($file_to_open, "r");
	while(!feof($file))
	{
		$line = fgets($file);
		$read_line = explode('[', $line);
		if ($read_line[0] == "place_x")
		{
			$number = explode('=', $line);
			array_push($locationX,$number[1]);		
		}
		else if ($read_line[0] == "place_y")
		{
			$number = explode('=', $line);
			array_push($locationY,$number[1]);					
		}
	}
	$location['x'] = $locationX;
	$location['y'] = $locationY;
	fclose($file);	
	
	return $location;
}
function getTimeFromFile ($file_to_open)
{
	$file = fopen($file_to_open, "r");
	$time = array();
	if(!feof($file))
	{
		$line = fgets($file);
		$read_line = explode('=', $line);	
		for ($i = 1; $i < count($read_line); $i++)
		{
			$line_number = explode('&', $read_line[$i]);
			$time[$i] = $line_number[0]." ";
		}
	}
	fclose($file);
	
	return $time;
}
//Get int $id return 
//Amount of pages, and time & location for each page as arrays.
function getStoryById ($id, $cat)
{
	$dir  	  = 'stories/'.$cat.'/story'.$id;
	$files 	  = scandir($dir, 1);
	$location = array();
	$time 	  = array();
	$urlData;
	$amount_of_files = (count($files) - 5) / 4;
	
	
	for($i = 1; $i <= $amount_of_files; $i++)
	{
		$time[$i] 	  = getTimeFromFile($dir."/time".$i.".txt");
		$location[$i] = getLocationFromFile($dir."/location".$i.".dat");
		$urlData      = getURLOptions ($dir."/urls.txt");
		//location is a 2D array - location[x][1-n], location[y][1-n]
	}
	//echo $time[1][1]; 		  First page, first time.
	//echo $location[1]['x'][0];  First page, first x.
	//echo $location[1]['y'][0];  First page, first y.
	
	//print_r(json_encode($location));	
	
	$return_object['amount']   = $amount_of_files;
	$return_object['time'] 	   = $time;
	$return_object['location'] = $location;
	$return_object['urlData']  = $urlData;
	
	//echo json_encode($return_object);
	return json_encode($return_object);
}
//getStoryById('1','adv');

?>