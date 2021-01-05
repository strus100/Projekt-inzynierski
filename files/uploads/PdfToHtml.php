<?php
	
class PdfToHtml {
	private $fileName;
	
	function __construct( $fileName ){
		$this->fileName = $fileName;

	}
	
	function translate(){
		echo shell_exec("pdftohtml -p -c $this->fileName");
	}
	
}

$x = new PdfToHtml("lab.pdf");
$x->translate();
echo "pdf to html converted!";
?>