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

		$output .= "<style>
		*{
            scrollbar-width: thin; 
            -ms-overflow-style: none;
        }
        ::-webkit-scrollbar {
            width: 5px;
			height: 5px;
			background: #CCC;
        }
		::-webkit-scrollbar-thumb{
			background: #222;
		}
		</style>";

        $response->setContent($output);
    }
}
