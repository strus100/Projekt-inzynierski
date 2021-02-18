<?php

require_once __DIR__."/PeselGenerator.php";

use PHPUnit\Framework\TestCase;
use function PHPUnit\Framework\assertTrue;

class PeselGeneratorTest extends TestCase
{
    /** @test */
    public function shouldGenerateManPesel()
    {
        $peselGenerator = new PeselGenerator();
        $pesel = $peselGenerator->generateManPesel();

        assertTrue(  $pesel[9] % 2 == 1 );
    }

}

