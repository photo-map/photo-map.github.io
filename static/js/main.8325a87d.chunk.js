(this["webpackJsonpphoto-map.github.io"]=this["webpackJsonpphoto-map.github.io"]||[]).push([[0],{260:function(e,n,t){},292:function(e,n,t){},499:function(e,n,t){},515:function(e,n,t){},516:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),o=t(9),i=t.n(o),l=(t(260),t(17)),s=t(18),c=t(22),u=t(21),d=t(5),p=t.n(d),f=t(65),b=t(7),m=t.n(b),h=t(16),g=t(522),v=t(524),k=t(520),w=t(88),M=t(19),S=t.n(M),E=t(518),O=t(523);function y(e){return r.a.createElement(E.a,{content:e.children,title:null},r.a.createElement(O.a,null))}var I=t(237),j=t(89),C="google",F="amap",x="__privateFolderId__";function A(e){return new Promise((function(n,t){window.gapi.client.request(e).execute((function(e){n(e)}))}))}var L=function(){var e=Object(h.a)(m.a.mark((function e(n){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A({path:"https://www.googleapis.com/drive/v3/files/".concat(n.fileId)});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),P=function(){var e=Object(h.a)(m.a.mark((function e(n){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A({path:"https://www.googleapis.com/drive/v3/files",params:n});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),D=["files/imageMediaMetadata/location","files/thumbnailLink","files/webContentLink","files/webViewLink"].join(","),T=function(){var e=Object(h.a)(m.a.mark((function e(n){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,L({fileId:n});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),V=function(){var e=Object(h.a)(m.a.mark((function e(n){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,P({q:"'".concat(n,"' in parents and (mimeType='image/jpeg' or mimeType='image/png')"),fields:D});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),R=function(){var e=Object(h.a)(m.a.mark((function e(){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,P({q:"name='Photo Map' and mimeType='application/vnd.google-apps.folder'"});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),G=function(){var e=Object(h.a)(m.a.mark((function e(n){var t,a,r;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,R();case 2:return t=e.sent,a=t.files[0].id,e.next=6,V(a);case 6:return r=e.sent,e.abrupt("return",r.files);case 8:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();t(292);function N(e){var n=e.message;return n?r.a.createElement("div",{className:"message-wrapper"},r.a.createElement("div",{className:"message-body"},r.a.createElement("span",{className:"message-content"},n))):null}var U=t(45);function B(e){var n=e.latLng;console.log("You click on the Google Maps, latLng: ".concat(n.toString()))}var W=function(e){return r.a.createElement(U.GoogleMap,{defaultZoom:e.defaultZoom,defaultCenter:e.defaultCenter,defaultOptions:{mapTypeControlOptions:{position:window.google.maps.ControlPosition.TOP_RIGHT}},mapTypeId:"satellite",ref:e.refCallback,onClick:B},e.children)},_=t(138),z=S()("photo-map:src/Application/Map/GoogleMap/GoogleMapCompose.jsx"),J=Object(_.a)(Object(_.c)((function(e){return{googleMapURL:"https://maps.googleapis.com/maps/api/js?key=".concat("AIzaSyBI9zDejJ09aIP8kw3GvTOBbYWwcOl0DUY","&v=3.exp&libraries=geometry,drawing,places"),loadingElement:r.a.createElement("div",{style:{height:"100%"}}),containerElement:r.a.createElement("div",{style:{height:"100vh"}}),mapElement:r.a.createElement("div",{style:{height:"100%"}})}})),Object(_.b)((function(e){var n={map:void 0};return{refCallback:function(){return function(t){z("refCallback()()",t),n.map=t,null!==t?e.onMapMounted(t):e.onMapUnmounted()}}}})),U.withScriptjs,U.withGoogleMap),H=t(251);function Y(e){var n=Object(a.useState)(!1),t=Object(H.a)(n,2),o=t[0],i=t[1];return r.a.createElement(U.Marker,Object.assign({},e,{onClick:function(){return i(!0)}}),o&&r.a.createElement(U.InfoWindow,{onCloseClick:function(){return i(!1)}},r.a.createElement("div",{className:"photo-marker-info-window"},r.a.createElement("a",{href:e.icon.url,target:"_blank",rel:"noopener noreferrer"},r.a.createElement("img",{src:e.icon.url,alt:"Photos"})))))}var Z=function(e,n){if(0!==n.length){var t=new window.google.maps.LatLngBounds;n.forEach((function(e){!1!==e.visible&&e.files.forEach((function(e){t.extend({lat:e.imageMediaMetadata.location.latitude,lng:e.imageMediaMetadata.location.longitude})}))})),e.fitBounds(t)}},q=S()("photo-map:src/Application/Map/GoogleMap/index.jsx"),K=J(W),Q={lat:39.873806,lng:116.22555},$={lat:39.872542,lng:116.219536},X=function(e){Object(c.a)(t,e);var n=Object(u.a)(t);function t(){var e;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(e=n.call.apply(n,[this].concat(o))).handleMapMounted=function(n){q("handleMapMounted()",n),e.map=n,Z(n,e.props.folders)},e.handleMapUnmounted=function(){q("handleMapUnmounted()")},e.fitMarkersSubscriber=function(n){q("fitMarkersSubscriber()",n),e.map?Z(e.map,e.props.folders):console.error("this.map of Google Map is undefined!")},e.addSubscribers=function(){e.fitMarkersToken=p.a.subscribe(ve,e.fitMarkersSubscriber)},e.removeSubscribers=function(){p.a.unsubscribe(e.fitMarkersToken)},e.renderPhotoMarkers=function(){var n=[];return e.props.folders.forEach((function(e){!1!==e.visible&&e.files.forEach((function(e){var t={anchor:{x:0,y:0},labelOrigin:{x:0,y:0},scaledSize:{height:64,width:64},url:e.thumbnailLink};n.push(r.a.createElement(Y,{key:JSON.stringify(e),position:{lat:e.imageMediaMetadata.location.latitude,lng:e.imageMediaMetadata.location.longitude},icon:t}))}))})),n},e}return Object(s.a)(t,[{key:"componentDidMount",value:function(){this.addSubscribers()}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){q("render()",this.props);var e=this.props,n=e.defaultZoom,t=e.defaultCenter,a=e.markers;return r.a.createElement(K,{ref:this.mapRef,defaultZoom:n,defaultCenter:t,onMapMounted:this.handleMapMounted,onMapUnmounted:this.handleMapUnmounted},a.map((function(e,n){var t=Object.assign({},e);return r.a.createElement(U.Marker,Object.assign({key:n},t))})),r.a.createElement(U.Marker,{label:"Map",position:Q}),r.a.createElement(U.Marker,{label:"Satelite",position:$}),this.renderPhotoMarkers())}}]),t}(a.Component),ee=t(168),ne=t(525),te=t(519),ae=S()("photo-map:src/Application/MenuDrawer/FolderList.jsx"),re="publicfolder.add",oe="pmap:publicFolders",ie="pmap:privateFolderVisible",le=function(e){var n={};return e.forEach((function(e){n[e.folderId]=e.visible})),JSON.stringify(n)},se=function(){return JSON.parse(localStorage.getItem(oe))},ce=function(e){Object(c.a)(t,e);var n=Object(u.a)(t);function t(){var e;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(e=n.call.apply(n,[this].concat(o))).state={privateFolderVisible:!0,publicFolders:[]},e.handlePrivateFolderCheckboxChange=function(n){var t=n.target.checked;e.updatePrivateFolderVisible(t),p.a.publish(t?ye:Ie,{folderId:x})},e.addSubscribers=function(){e.openDrawerToken=p.a.subscribe(re,e.addPublicFolderSubscriber)},e.removeSubscribers=function(){p.a.unsubscribe(e.openDrawerToken)},e.addPublicFolderSubscriber=function(n,t){e.addPublicFolder(t)},e.updatePrivateFolderVisible=function(n){e.setState({privateFolderVisible:n}),localStorage.setItem(ie,n)},e.addPublicFolder=function(n){var t=e.state.publicFolders,a=[].concat(Object(j.a)(t),[n]);e.setState({publicFolders:a}),localStorage.setItem(oe,le(a))},e.updatePublicFolderVisiable=function(n,t){var a=e.state.publicFolders,r=Object(j.a)(a);r.forEach((function(e,a){e.folderId===n&&(r[a]=Object(ee.a)(Object(ee.a)({},e),{},{visible:t}))})),e.setState({publicFolders:r}),localStorage.setItem(oe,le(r))},e.updateMarkersVisible=function(e,n){p.a.publish(e?ye:Ie,{folderId:n})},e.removePublicFolder=function(n){e.setState((function(e){var t=e.publicFolders.filter((function(e){return e.folderId!==n}));return localStorage.setItem(oe,le(t)),{publicFolders:t}}))},e.removeMarkersInFolder=function(e){p.a.publish(Oe,{folderId:e})},e.renderPublicFolders=function(){var n=e.state.publicFolders;return 0===n.length?"No data":n.map(e.renderPublicFolder)},e.renderPublicFolder=function(n){var t=n.folderId;return r.a.createElement("div",{key:n.folderId},r.a.createElement(ne.a,{checked:n.visible,onChange:function(n){e.updatePublicFolderVisiable(t,n.target.checked),e.updateMarkersVisible(n.target.checked,t)}},n.folderName," : ",n.folderId," ",r.a.createElement(te.a,{title:"Are you sure delete this folder?",onConfirm:function(){e.removePublicFolder(t),e.removeMarkersInFolder(t)},onCancel:function(){},okText:"Yes",cancelText:"No"},r.a.createElement(w.a,{size:"small",type:"danger"},"Del"))))},e}return Object(s.a)(t,[{key:"componentDidMount",value:function(){this.addSubscribers(),this.setState({privateFolderVisible:"true"===localStorage.getItem(ie)})}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){return ae("render()",this.props,this.state),r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement("h3",null,"Private folder in Google Drive"),r.a.createElement(ne.a,{checked:this.state.privateFolderVisible,onChange:this.handlePrivateFolderCheckboxChange},'"Photo Map" folder in Google Drive of the login user')),r.a.createElement("div",null,r.a.createElement("h3",null,"Public folder in Google Drive"),this.renderPublicFolders()))}}]),t}(a.Component),ue=function(){var e=Object(h.a)(m.a.mark((function e(n){var t,a;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,T(n);case 2:return t=e.sent,e.next=5,V(n);case 5:if(!(a=e.sent).error){e.next=9;break}throw console.error("Failed to get photos in a public folders, response:",a),new Error(a.error.message);case 9:return e.abrupt("return",{files:a.files,visible:!0,folderId:n,folderName:t.name});case 10:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),de=function(){var e=Object(h.a)(m.a.mark((function e(){var n;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=JSON.parse(localStorage.getItem(oe))){e.next=3;break}return e.abrupt("return",[]);case 3:return e.next=5,Promise.all(Object.keys(n).map(function(){var e=Object(h.a)(m.a.mark((function e(n){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ue(n);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()));case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),pe=function(){var e=Object(h.a)(m.a.mark((function e(n){var t;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={files:n,visible:"true"===localStorage.getItem(ie),folderId:x},p.a.publish(Se,t),e.next=4,de();case 4:e.sent.forEach((function(e){return p.a.publish(Se,e)}));case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),fe=S()("photo-map:src/Application/Map/index.jsx"),be={latitude:39.871446,longitude:116.215768},me={lat:39.871446,lng:116.215768},he="pmap::selectedMap",ge="map.switchmap",ve="googlemap.fitmarkers",ke=function(e){Object(c.a)(t,e);var n=Object(u.a)(t);function t(e){var a;return Object(l.a)(this,t),(a=n.call(this,e)).handleMapChange=function(e){a.setMap(e)},a.handleRenderFinish=function(){a.setState({message:""})},a.handleLoginSuccess=function(){var e=Object(h.a)(m.a.mark((function e(n){var t,r,o,i;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return fe("handleLoginSuccess",n),a.setState({message:"Login successfully, try to load photos in Google Drive..."}),e.next=4,G();case 4:return t=e.sent,a.setState({message:""}),r=!1,o=a.state.folders.map((function(e){return e.folderId===x&&(r=!0,e.files=t),e})),r||o.push({folderId:x,files:t}),a.setState({folders:o}),e.next=12,de();case 12:if(i=e.sent,a.setState({folders:[].concat(Object(j.a)(a.state.folders),Object(j.a)(i))}),i.forEach((function(e){p.a.publish(re,e)})),"amap"!==a.state.selectedMap){e.next=18;break}return e.next=18,pe(t);case 18:p.a.publish(ve);case 19:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),a.handleAMapInstanceCreated=function(e){fe("handleAMapInstanceCreated()",window.AMap),a.setState({amapLoaded:!0})},a.handleSignedOut=function(){a.setState({folders:[]}),p.a.publish(Ee)},a.handleDrawerOpen=function(){p.a.publish(_e)},a.addSubscribers=function(){a.switchMapToken=p.a.subscribe(ge,a.switchMapSubscriber),a.showMarkersToken=p.a.subscribe("amap.showmarkers",a.showMarkersSubscriber),a.hideMarkersToken=p.a.subscribe("amap.hidemarkers",a.hideMarkersSubscriber)},a.removeSubscribers=function(){p.a.unsubscribe(a.switchMapToken)},a.switchMapSubscriber=function(){a.setMap(a.state.selectedMap===F?C:F)},a.showMarkersSubscriber=function(e,n){a.updateMarkersInFolderVisible(n.folderId,!0)},a.hideMarkersSubscriber=function(e,n){a.updateMarkersInFolderVisible(n.folderId,!1)},a.updateMarkersInFolderVisible=function(e,n){var t=a.state.folders.map((function(t){return t.folderId===e&&(t.visible=n),t}));a.setState({folder:t})},a.setMap=function(e){a.setState({selectedMap:e}),localStorage.setItem(he,e)},a.renderMap=function(){var e=a.state,n=e.selectedMap,t=e.folders;return n===F?r.a.createElement(je,{defaultCenter:be,defaultZoom:16,onMapInstanceCreated:a.handleAMapInstanceCreated}):n===C?r.a.createElement(X,{defaultZoom:16,defaultCenter:me,markers:[],folders:t}):null},a.state={folders:[],amapLoaded:!1,message:"Rendering Google login button..."},a.state.selectedMap=localStorage.getItem(he)||"amap",a}return Object(s.a)(t,[{key:"componentDidMount",value:function(){this.addSubscribers()}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){var e=this.state,n=e.selectedMap,t=e.message;return r.a.createElement("div",{className:"map-wrapper"},r.a.createElement(N,{message:t}),this.renderMap(),r.a.createElement("div",{className:"menu-btn-wrapper"},r.a.createElement(w.a,{onClick:this.handleDrawerOpen},"Menu")),r.a.createElement(Je,{selectedMap:n,onRenderFinish:this.handleRenderFinish,onLoginSuccess:this.handleLoginSuccess,onSignedOut:this.handleSignedOut,onMapChange:this.handleMapChange}))}}]),t}(a.Component),we=function(e,n){var t=[];return e.getAllOverlays("marker").forEach((function(e){e.getExtData().folderId===n&&t.push(e)})),t},Me=(t(499),S()("photo-map:src/Application/Map/AMap/index.jsx")),Se="amap.addmarkers",Ee="amap.removeallmarkers",Oe="amap.removemarkersinfolder",ye="amap.showmarkers",Ie="amap.hidemarkers",je=function(e){Object(c.a)(t,e);var n=Object(u.a)(t);function t(){var e;Object(l.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=n.call.apply(n,[this].concat(r))).map=null,e.allMarkers=[],e.addSubscribers=function(){e.addMarkersToken=p.a.subscribe(Se,e.addMarkersSubscriber),e.removeAllMarkersToken=p.a.subscribe(Ee,e.removeAllMarkersSubscriber),e.removeMarkersInFolderToken=p.a.subscribe(Oe,e.removeMarkersInFolderSubscriber),e.showMarkersToken=p.a.subscribe(ye,e.showMarkersSubscriber),e.hideMarkersToken=p.a.subscribe(Ie,e.hideMarkersSubscriber),e.fitMarkersToken=p.a.subscribe(ve,e.fitMarkersSubscriber)},e.removeSubscribers=function(){p.a.unsubscribe(e.addMarkersToken),p.a.unsubscribe(e.removeAllMarkersToken),p.a.unsubscribe(e.removeMarkersInFolderToken),p.a.unsubscribe(e.showMarkersToken),p.a.unsubscribe(e.hideMarkersToken)},e.addMarkersSubscriber=function(n,t){e.addMarkers(t.files,t.visible,t.folderId)},e.removeMarkersInFolderSubscriber=function(n,t){e.removeMarkersInFolder(t.folderId)},e.removeAllMarkersSubscriber=function(n){e.removeAllMarkers()},e.showMarkersSubscriber=function(n,t){e.updateMarkersInFolderVisible(t.folderId,!0)},e.hideMarkersSubscriber=function(n,t){e.updateMarkersInFolderVisible(t.folderId,!1)},e.fitMarkersSubscriber=function(n){e.map?e.map.setFitView():console.error("this.map of AMap is undefined!")},e.updateMarkersInFolderVisible=function(n,t){we(e.map,n).forEach((function(e){t?e.show():e.hide()})),e.map.setFitView()},e.genMarker=function(n,t,a){return new window.AMap.Marker({map:e.map,visible:a,position:n.lnglat,icon:new window.AMap.Icon({size:new window.AMap.Size(64,64),image:n.thumbnail,imageSize:new window.AMap.Size(64,64)}),extData:{folderId:t}})},e.addMarkers=function(n){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=arguments.length>2?arguments[2]:void 0;if(window.AMap){var r=[];n.forEach((function(e){r.push([e.imageMediaMetadata.location.longitude,e.imageMediaMetadata.location.latitude])})),Me("window.AMap.convertFrom() loading"),window.AMap.convertFrom(r,"gps",(function(r,o){(Me("window.AMap.convertFrom",r,o),"ok"===o.info)&&(o.locations.map((function(e,t){return{lnglat:e,thumbnail:n[t].thumbnailLink,webViewLink:n[t].webViewLink}})).forEach((function(n){var r=e.genMarker(n,a,t);r.content='<div><a target="_blank" href="'.concat(n.webViewLink,'"><img src="').concat(n.thumbnail,'"></a></div>'),e.allMarkers.push(r);r.on("click",(function(n){var t=new window.AMap.InfoWindow({offset:new window.AMap.Pixel(0,-30)});t.setContent(n.target.content),t.open(e.map,n.target.getPosition())}))})),e.map.setFitView())}))}else alert("We are about to convert location from GPS to AMap, but AMap still not loaded!")},e.removeMarkersInFolder=function(n){var t=[];e.map.getAllOverlays("marker").forEach((function(e){e.getExtData().folderId===n&&t.push(e)})),e.map.remove(t)},e.removeAllMarkers=function(){e.map.remove(e.allMarkers)},e}return Object(s.a)(t,[{key:"componentDidMount",value:function(){this.addSubscribers()}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){var e=this,n=this.props,t=n.defaultCenter,a=n.defaultZoom,o={created:function(n){e.props.onMapInstanceCreated(n),e.map=n},click:function(e){Me("AMap event: click",e);var n=e.lnglat;console.log("You click on the AMap, lngLat: ".concat(n.toString()))}};return r.a.createElement("div",{className:"amap-wrapper"},r.a.createElement(I.Map,{amapkey:"2af81967e36bb62f50534e7b5c530ff9",version:"1.4.15",center:t,zoom:a,events:o}))}}]),t}(a.Component),Ce=t(521),Fe=S()("photo-map:src/Application/MapSelector.jsx"),xe={display:"block",height:"30px",lineHeight:"30px"};function Ae(e){Fe("render()");var n=e.selectedMap;return r.a.createElement("div",{className:"map-selector"},r.a.createElement("h3",null,"Choose Map:"),r.a.createElement(Ce.a.Group,{onChange:function(n){var t=n.target.value;e.onChange&&e.onChange(t)},value:n},r.a.createElement(Ce.a,{style:xe,value:"amap"},"AMap"),r.a.createElement(Ce.a,{style:xe,value:"google"},"Google Maps")))}var Le=function(e){Object(c.a)(t,e);var n=Object(u.a)(t);function t(){return Object(l.a)(this,t),n.apply(this,arguments)}return Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("span",null,"Photo Map"," ",r.a.createElement(y,null,r.a.createElement("div",null,"Please read the"," ",r.a.createElement(f.a.OutboundLink,{eventLabel:"HowToUse",to:"https://github.com/photo-map/photo-map.github.io/blob/master/help/HOW_TO_USE.md#how-to-use",target:"_blank"},"How to use")," ","document in GitHub repo.")))}}]),t}(a.Component),Pe=S()("photo-map:src/Application/helpers/renderGoogleLoginBtn.js");var De=S()("photo-map:src/Application/MenuDrawer/GoogleLogin.jsx"),Te=["profile","email","https://www.googleapis.com/auth/drive"].join(" "),Ve=function(e){Object(c.a)(t,e);var n=Object(u.a)(t);function t(){var e;Object(l.a)(this,t);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(e=n.call.apply(n,[this].concat(o))).state={gapiAuth2Loaded:!1,signedIn:!1},e.handleSignOutBtnClick=function(){window.gapi.auth2.getAuthInstance().signOut().then((function(){De("User signed out by clicking button."),f.a.event({category:"Auth",action:"User logout"}),e.setState({signedIn:!1}),e.props.onSignedOut()}))},e.renderLoginBtn=function(){var e=window.gapi.auth2.getAuthInstance();return e&&e.isSignedIn.get()?null:r.a.createElement("div",{id:"custom-google-login-button"})},e.renderSignOutBtn=function(){return e.state.signedIn?r.a.createElement("button",{onClick:e.handleSignOutBtnClick},"Sign out"):null},e}return Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;window.gapi.load("auth2",(function(){De("auth2 loaded"),e.setState({gapiAuth2Loaded:!0});var n=window.gapi.auth2.init({client_id:"769870583187-6p6tvl5nh7qc8m9hrgqh285siqm9oc37.apps.googleusercontent.com",scope:Te});!function(e,n){Pe("renderGoogleLoginBtn()",e,n),n.attachClickHandler("custom-google-login-button",{},(function(n){Pe("onSuccess()",n),Pe("User signed in by clicking button."),f.a.event({category:"Auth",action:"User login"}),e.onLoginSuccess(n)}),(function(e){Pe("onFailure(), error:",e)})),n.isSignedIn.listen((function(e){Pe("signinChanged()",e)})),n.currentUser.listen((function(e){Pe("userChanged()",e)})),window.gapi.load("signin2",(function(){Pe("signin2 loaded"),window.gapi.signin2.render("custom-google-login-button",{onsuccess:function(n){Pe("handleSuccess()",n),Pe("User already signed in when rendering button."),e.onLoginSuccess(n)},onfailure:function(e,n,t){Pe("handleFailure",e,n,t)}}),e.onRenderFinish()}))}({onLoginSuccess:function(n){e.setState({signedIn:!0}),e.props.onLoginSuccess(n)},onRenderFinish:e.props.onRenderFinish},n)}))}},{key:"render",value:function(){return this.state.gapiAuth2Loaded?r.a.createElement("div",null,r.a.createElement("h3",null,"Google Login"),this.renderLoginBtn(),this.renderSignOutBtn()):r.a.createElement("div",null,'The "auth2" gapi library doesn\'t loaded yet.')}}]),t}(a.Component),Re=t(87),Ge=function(e){return e.replace("https://drive.google.com/drive/folders/","").replace("?usp=sharing","")},Ne=function(e){var n,t=(n={},Object(Re.a)(n,ie,e.getItem(ie)),Object(Re.a)(n,oe,e.getItem(oe)),Object(Re.a)(n,he,e.getItem(he)),n);return"data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(t,null,2))},Ue=function(e,n){e.setItem(ie,n["pmap:privateFolderVisible"]),e.setItem(oe,n["pmap:publicFolders"]),e.setItem(he,n["pmap::selectedMap"])},Be=function(e){Object(c.a)(t,e);var n=Object(u.a)(t);function t(e){var a;return Object(l.a)(this,t),(a=n.call(this,e)).handleDownload=function(){a.setState({href:Ne(localStorage)},(function(){a.downloadRef&&a.downloadRef.current?a.downloadRef.current.click():alert("downloadRef or node is undefined!")}))},a.handleImport=function(){a.inputRef&&a.inputRef.current?a.inputRef.current.click():alert("inputRef or node is undefined!")},a.handleChange=function(){var e=Object(h.a)(m.a.mark((function e(n){var t,a,r;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t=n.target.files[0])){e.next=7;break}return e.next=4,new Response(t).text();case 4:a=e.sent,r=JSON.parse(a),Ue(localStorage,r);case 7:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),a.downloadRef=r.a.createRef(),a.inputRef=r.a.createRef(),a.state={href:"{}"},a}return Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("h3",null,"Import/Export application config"),r.a.createElement("a",{ref:this.downloadRef,href:this.state.href,style:{display:"none"},download:"photo-map-config.json"},"Download Config File"),r.a.createElement(w.a,{onClick:this.handleDownload},"Export"),r.a.createElement("input",{ref:this.inputRef,className:"import-config-file-helper",type:"file",style:{display:"none"},onChange:this.handleChange}),r.a.createElement(w.a,{onClick:this.handleImport},"Import"))}}]),t}(a.Component),We=S()("photo-map:src/Application/MenuDrawer/index.jsx"),_e="menudrawer.open",ze="menudrawer.openclose",Je=function(e){Object(c.a)(t,e);var n=Object(u.a)(t);function t(){var e;Object(l.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=n.call.apply(n,[this].concat(r))).state={drawerVisible:!1,publicFolderLink:"",loading:!1},e.handleDrawerClose=function(){e.setVisible(!1)},e.handlePublicFolderLinkChange=function(n){e.setState({publicFolderLink:n.target.value})},e.handlePublicFolderInputPressEnter=function(){e.loadPublicFolderAndAddMarkers()},e.handleLoadPublicFolderBtnClick=function(){e.loadPublicFolderAndAddMarkers()},e.loadPublicFolderAndAddMarkers=Object(h.a)(m.a.mark((function n(){var t,a;return m.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!e.state.loading){n.next=3;break}return g.b.warn("Previous public folder is loading now, please wait a moment."),n.abrupt("return");case 3:if(t=Ge(e.state.publicFolderLink),void 0===se()[t]){n.next=7;break}return g.b.warn("There is an existing public folder!"),n.abrupt("return");case 7:return a=null,n.prev=8,e.setState({loading:!0}),n.next=12,ue(t);case 12:a=n.sent,e.setState({loading:!1}),n.next=22;break;case 16:return n.prev=16,n.t0=n.catch(8),console.error("failed to get photos in a public folder, error:",n.t0),g.b.error(n.t0.message),e.setState({loading:!1}),n.abrupt("return");case 22:p.a.publish(re,a),p.a.publish(Se,a);case 24:case"end":return n.stop()}}),n,null,[[8,16]])}))),e.setVisible=function(n){e.setState({drawerVisible:n})},e.openDrawerSubscriber=function(n){e.setVisible(!0)},e.openCloseDrawerSubscriber=function(n){e.setVisible(!e.state.drawerVisible)},e.addSubscribers=function(){e.openDrawerToken=p.a.subscribe(_e,e.openDrawerSubscriber),e.openCloseDrawerToken=p.a.subscribe(ze,e.openCloseDrawerSubscriber)},e.removeSubscribers=function(){p.a.unsubscribe(e.openDrawerToken)},e}return Object(s.a)(t,[{key:"componentDidMount",value:function(){this.addSubscribers()}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){We("render()");var e=this.props.selectedMap,n=this.state,t=n.drawerVisible,a=n.publicFolderLink;return r.a.createElement("div",{className:"menu-drawer"},r.a.createElement(v.a,{className:"menu-drawer",width:512,title:r.a.createElement(Le,null),placement:"left",closable:!1,forceRender:!0,visible:t,onClose:this.handleDrawerClose},r.a.createElement(Ae,{selectedMap:e,onChange:this.props.onMapChange}),r.a.createElement(Ve,{onLoginSuccess:this.props.onLoginSuccess,onRenderFinish:this.props.onRenderFinish,onSignedOut:this.props.onSignedOut}),r.a.createElement("div",null,r.a.createElement("div",null,"Public folder link:"," ",r.a.createElement(y,null,r.a.createElement("div",null,r.a.createElement("div",null,"Please fill the public folder link. For example:"),r.a.createElement("div",null,"https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing")))),r.a.createElement(k.a,{value:a,onChange:this.handlePublicFolderLinkChange,onPressEnter:this.handlePublicFolderInputPressEnter}),r.a.createElement(w.a,{disabled:this.state.loading,onClick:this.handleLoadPublicFolderBtnClick},"Load"),r.a.createElement("hr",null),r.a.createElement(ce,null),r.a.createElement("hr",null),r.a.createElement(Be,null))))}}]),t}(a.Component),He=function(){f.a.initialize("UA-48270916-5",{})},Ye=function(){document.addEventListener("keyup",(function(e){switch(e.code){case"KeyM":p.a.publish(ze);break;case"KeyS":p.a.publish(ge)}}),!1)},Ze=function(){return new Promise((function(e,n){window.gapi.load("client",(function(){e()}))}))};function qe(){return r.a.createElement("div",{className:"website-warning"},r.a.createElement("p",null,"Google API not loaded!"),r.a.createElement("p",null,"Maybe you need to turn off the Adblock Plus for this website."),r.a.createElement("p",null,"If you still have problem, please"," ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://github.com/photo-map/photo-map.github.io/issues"},"raise an issue")," ","in the GitHub project."))}t(514),t(515);var Ke=function(e){Object(c.a)(t,e);var n=Object(u.a)(t);function t(){var e;Object(l.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=n.call.apply(n,[this].concat(r))).state={gapiLoaded:!1,gapiClientLoading:!1},e.initApplication=function(){He(),window.gapiLoadedFlag&&(e.setState({gapiLoaded:!0}),e.loadGapiClient()),Ye()},e.loadGapiClient=function(){e.setState({gapiClientLoading:!0}),Ze().then((function(){e.setState({gapiClientLoading:!1})}))},e}return Object(s.a)(t,[{key:"componentDidMount",value:function(){this.initApplication()}},{key:"render",value:function(){return this.state.gapiLoaded?this.state.gapiClientLoading?r.a.createElement("div",null,"gapi client lib is loading"):r.a.createElement("div",{className:"application photo-map"},r.a.createElement(ke,null)):r.a.createElement(qe,null)}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(Ke,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[516,1,2]]]);
//# sourceMappingURL=main.8325a87d.chunk.js.map