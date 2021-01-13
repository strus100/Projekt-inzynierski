<?php



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

	if( 
	$this->extension == "ppt" ||
	$this->extension == "pptx" ||
	$this->extension == "odp" ||
	$this->extension == "uop" 
	){
		$cmd = "libreoffice --headless --invisible --convert-to pdf ".$this->folderPath.$this->fileName;
		echo $cmd."<br>";
		shell_exec( $cmd ); 
		$this->fileName = $this->name.".pdf";
		$this->extension = "pdf";
	}

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
    	shell_exec( "rm -rf ".$this->folderPath.$this->name );
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