import React from 'react';

export default ({error}) =>
        //<div style={{margin: 0 + " auto", height: 100+"vh", lineHeight: 100+"vh", width: 100+"%"}}>
        <div className="loader--div">
			<div className="loader--div-circle">Loading...</div>
		  	<h1 className="loader--div-h1">{error ? "Błąd łączenia z serwerem" : "Łączenie z serwerem..."}</h1>
		</div>