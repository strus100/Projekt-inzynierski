import React from 'react';

export default ({cookieDecisionVal, cookieOK}) =>
<div id="simplecookienotification_v01" style={{display: cookieDecisionVal}}>
    <div>
        <span id="simplecookienotification_v01_powiadomienie">Ta strona używa plików cookies.</span><span id="br_pc_title_html"><br></br></span>
        <a id="simplecookienotification_v01_polityka" href="http://jakwylaczyccookie.pl/polityka-cookie/">Polityka Prywatności</a><span id="br_pc2_title_html"> &nbsp;&nbsp; </span>
        <a id="simplecookienotification_v01_info" href="http://jakwylaczyccookie.pl/jak-wylaczyc-pliki-cookies/">Jak wyłączyć cookies?</a><div id="jwc_hr1"></div>
        <a id="okbutton" onClick={cookieOK}>ROZUMIEM</a><div id="jwc_hr2"></div>
    </div>
</div>