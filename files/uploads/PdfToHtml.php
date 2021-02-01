<?php

require_once(__DIR__ . '/vendor/autoload.php');


class PdfToHtml {

    private $fileName;
    private $name;
	private $extension;
	private $folderPath = "/var/www/html/files/uploads/";
	

    function __construct( $fileName ){

        $this->fileName = $fileName;
		$this->name = explode( ".", $fileName )[0];
		$this->extension = explode( ".", $fileName )[1];
	
	}



    function translateFromPresentation(){

/*	if( 
	$this->extension == "ppt" ||
	$this->extension == "pptx" ||
	$this->extension == "odp" ||
	$this->extension == "uop" 
	){
		// Configure API key authorization: Apikey
		$config = Swagger\Client\Configuration::getDefaultConfiguration()->setApiKey('Apikey', 'c019885c-ae0d-4f7d-a765-5e82d2530d1e');

		$apiInstance = new Swagger\Client\Api\ConvertDocumentApi(
        
		new GuzzleHttp\Client(),
		$config
		);
	
		try {
			$result = $apiInstance->convertDocumentPptxToPdf( "../uploads/".$this->fileName);
			print_r($result);

			echo $myfile = fopen( "../uploads/".$this->name.".pdf", "c+" ) or die("Unable to open file!");
			echo fwrite($myfile, $result);
			fclose($myfile);
			
			$this->fileName = $this->name.".pdf";
			$this->extension = "pdf";
		} catch (Exception $e) {
			echo 'Exception when calling ConvertDocumentApi->convertDocumentPptxToPdf: ', $e->getMessage(), PHP_EOL;
		}
	}
*/
    }


    function translate(){
	if( $this->extension == "pdf" ){
		$this->createFolder();
		$this->moveToFolder();
		$this->convertPdf();

		return $this->name."/".$this->name."-html.html"; 
    } 
	else {
		return $this->fileName;
		}
	}
	
    function remove(){
	if( 
	$this->extension == "ppt" ||
	$this->extension == "pptx" ||
	$this->extension == "odp" ||
	$this->extension == "uop" ||
	$this->extension == "pdf" 
	){
		$nameToDelete = str_replace(' ', '\ ', $this->name );
		$cmd = "rm -rf ".$this->folderPath.$nameToDelete;
    	shell_exec( $cmd );
		return true;
	}
	return false;
    }


	function createFolder(){
		$cmdMakeDir = "mkdir -m 777 ".$this->folderPath.$this->name;
		echo $cmdMakeDir."<br>";
		echo shell_exec( $cmdMakeDir );
	}

	

	function moveToFolder(){
		$cmdMoveFileFrom = $this->folderPath.$this->fileName;
		$cmdMoveFileTo = $this->folderPath.$this->name."/".$this->fileName;
		echo $cmdMoveFileFrom."<br>";
		echo $cmdMoveFileTo."<br>";
		echo rename( $cmdMoveFileFrom, $cmdMoveFileTo );
	}

	

	function convertPdf(){
		$cmdPdf = "pdftohtml -p -c -q -s ".$this->folderPath.$this->name."/".$this->fileName;
		echo $cmdPdf."<br>";
		echo shell_exec( $cmdPdf );
	}
}

//FOR MANUAL TESTS
//$name = $_GET["name"];
//$x = new PdfToHtml($name);
//echo $x->translateFromPresentation();
//echo $x->translate();
//$x->remove();
?>