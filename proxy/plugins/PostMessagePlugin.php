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

		$postMessage = "<script>
		window.addEventListener('message',function(event) {
			event.source.postMessage('post mnessage working '+event.origin, event.origin);
			scrollTo(0,parseInt(event.data));
		},false);
		</script>";

        $output = $response->getContent();

        $response->setContent($output);
    }
}
