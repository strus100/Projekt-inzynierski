<?php
use Proxy\Event\ProxyEvent;
use Proxy\Plugin\AbstractPlugin;

class PostMessagePlugin extends AbstractPlugin
{
    public function onCompleted(ProxyEvent $event)
    {
        $request = $event['request'];
        $response = $event['response'];

        $url = $request->getUri();

        if (!is_html($response->headers->get('content-type'))) {
            return;
        }

		$output = $response->getContent();

		$output .= "<style>::-webkit-scrollbar { width: 0px; height: 0px; }</style>";

        $response->setContent($output);
    }
}
