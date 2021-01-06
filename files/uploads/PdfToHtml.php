<?php

class PdfToHtml {
    private $fileName;
    private $name;

    function __construct( $fileName ){
        $this->fileName = $fileName;
		$this->name = explode( ".", $fileName )[0];
		$this->extension = explode( ".", $fileName )[1];
	}

    function translateFromPresentation(){
		echo $this->extension;
	if( 
	$this->extension == "ppt" ||
	$this->extension == "pptx" ||
	$this->extension == "odp" ||
	$this->extension == "uop" 
	){
		//OR unoconv -f pdf filenameWithExtenstion 	
		shell_exec( "libreoffice --headless --invisible --convert-to pdf ".$this->fileName ); 
	}
    }

    function translate(){
	shell_exec( "mkdir -m 777 uploads/".$this->name );
	rename( "uploads/".$this->fileName, "uploads/".$this->name."/".$this->fileName );
	$cmd = "pdftohtml -p -c -q uploads/".$this->name."/".$this->fileName;
        shell_exec($cmd);
	
	return $this->name."/".$this->name.".html"; 
    }

    function remove(){
    	shell_exec( "rm -rf ".$this->name );
    }
}

//FOR MANUAL TESTS
//$name = $_GET["name"];
//$x = new PdfToHtml($name);
//$x->translateFromPresentation();
//echo $x->translate();
?>
