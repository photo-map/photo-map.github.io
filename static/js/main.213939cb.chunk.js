(this["webpackJsonpphoto-map.github.io"]=this["webpackJsonpphoto-map.github.io"]||[]).push([[0],{256:function(e,t,n){e.exports=n(517)},261:function(e,t,n){},293:function(e,t,n){},500:function(e,t,n){},516:function(e,t,n){},517:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(9),i=n.n(o),l=(n(261),n(17)),s=n(18),c=n(21),u=n(22),d=n(5),p=n.n(d),f=n(65),m=n(7),b=n.n(m),h=n(16),g=n(523),v=n(525),k=n(521),w=n(88),M=n(19),S=n.n(M),E=n(519),y=n(524);function O(e){return r.a.createElement(E.a,{content:e.children,title:null},r.a.createElement(y.a,null))}var F=n(236),I=n(89);function j(e){return new Promise((function(t,n){window.gapi.client.request(e).execute((function(e){t(e)}))}))}var C=function(){var e=Object(h.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j({path:"https://www.googleapis.com/drive/v3/files/".concat(t.fileId)});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),x=function(){var e=Object(h.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j({path:"https://www.googleapis.com/drive/v3/files",params:t});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),A=["files/imageMediaMetadata/location","files/thumbnailLink","files/webContentLink","files/webViewLink"].join(","),L=function(){var e=Object(h.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C({fileId:t});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),P=function(){var e=Object(h.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x({q:"'".concat(t,"' in parents and (mimeType='image/jpeg' or mimeType='image/png')"),fields:A});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),V=function(){var e=Object(h.a)(b.a.mark((function e(){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x({q:"name='Photo Map' and mimeType='application/vnd.google-apps.folder'"});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),D=function(){var e=Object(h.a)(b.a.mark((function e(t){var n,a,r;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,V();case 2:return n=e.sent,a=n.files[0].id,e.next=6,P(a);case 6:return r=e.sent,e.abrupt("return",r.files);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();n(293);function T(e){var t=e.message;return t?r.a.createElement("div",{className:"message-wrapper"},r.a.createElement("div",{className:"message-body"},r.a.createElement("span",{className:"message-content"},t))):null}var R=n(45);function G(e){var t=e.latLng;console.log("You click on the Google Maps, latLng: ".concat(t.toString()))}var _=function(e){return r.a.createElement(R.GoogleMap,{defaultZoom:e.defaultZoom,defaultCenter:e.defaultCenter,defaultOptions:{mapTypeControlOptions:{position:window.google.maps.ControlPosition.TOP_RIGHT}},mapTypeId:"satellite",ref:e.refCallback,onClick:G},e.children)},N=n(138),U=S()("photo-map:src/Application/Map/GoogleMap/GoogleMapCompose.jsx"),B=Object(N.a)(Object(N.c)((function(e){return{googleMapURL:"https://maps.googleapis.com/maps/api/js?key=".concat("AIzaSyBI9zDejJ09aIP8kw3GvTOBbYWwcOl0DUY","&v=3.exp&libraries=geometry,drawing,places"),loadingElement:r.a.createElement("div",{style:{height:"100%"}}),containerElement:r.a.createElement("div",{style:{height:"100vh"}}),mapElement:r.a.createElement("div",{style:{height:"100%"}})}})),Object(N.b)((function(e){var t={map:void 0};return{refCallback:function(){return function(n){U("refCallback()()",n),t.map=n,null!==n?e.onMapMounted(n):e.onMapUnmounted()}}}})),R.withScriptjs,R.withGoogleMap),W=n(251);function z(e){var t=Object(a.useState)(!1),n=Object(W.a)(t,2),o=n[0],i=n[1];return r.a.createElement(R.Marker,Object.assign({},e,{onClick:function(){return i(!0)}}),o&&r.a.createElement(R.InfoWindow,{onCloseClick:function(){return i(!1)}},r.a.createElement("div",null,r.a.createElement("img",{src:e.icon.url,alt:"Photos"}))))}var J=function(e,t){if(0!==t.length){var n=new window.google.maps.LatLngBounds;t.forEach((function(e){!1!==e.visible&&e.files.forEach((function(e){n.extend({lat:e.imageMediaMetadata.location.latitude,lng:e.imageMediaMetadata.location.longitude})}))})),e.fitBounds(n)}},H=S()("photo-map:src/Application/Map/GoogleMap/index.jsx"),Y=B(_),Z={lat:39.873806,lng:116.22555},q={lat:39.872542,lng:116.219536},K=function(e){Object(u.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(e=t.call.apply(t,[this].concat(o))).handleMapMounted=function(t){H("handleMapMounted()",t),e.map=t,J(t,e.props.folders)},e.handleMapUnmounted=function(){H("handleMapUnmounted()")},e.fitMarkersSubscriber=function(t){H("fitMarkersSubscriber()",t),e.map?J(e.map,e.props.folders):console.error("this.map of Google Map is undefined!")},e.addSubscribers=function(){e.fitMarkersToken=p.a.subscribe(ue,e.fitMarkersSubscriber)},e.removeSubscribers=function(){p.a.unsubscribe(e.fitMarkersToken)},e.renderPhotoMarkers=function(){var t=[];return e.props.folders.forEach((function(e){!1!==e.visible&&e.files.forEach((function(e){var n={anchor:{x:0,y:0},labelOrigin:{x:0,y:0},scaledSize:{height:64,width:64},url:e.thumbnailLink};t.push(r.a.createElement(z,{key:JSON.stringify(e),position:{lat:e.imageMediaMetadata.location.latitude,lng:e.imageMediaMetadata.location.longitude},icon:n}))}))})),t},e}return Object(s.a)(n,[{key:"componentDidMount",value:function(){this.addSubscribers()}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){H("render()",this.props);var e=this.props,t=e.defaultZoom,n=e.defaultCenter,a=e.markers;return r.a.createElement(Y,{ref:this.mapRef,defaultZoom:t,defaultCenter:n,onMapMounted:this.handleMapMounted,onMapUnmounted:this.handleMapUnmounted},a.map((function(e,t){var n=Object.assign({},e);return r.a.createElement(R.Marker,Object.assign({key:t},n))})),r.a.createElement(R.Marker,{label:"Map",position:Z}),r.a.createElement(R.Marker,{label:"Satelite",position:q}),this.renderPhotoMarkers())}}]),n}(a.Component),Q=n(238),$=n(526),X=n(520),ee=S()("photo-map:src/Application/MenuDrawer/FolderList.jsx"),te=function(e){var t={};return e.forEach((function(e){t[e.folderId]=e.visible})),JSON.stringify(t)},ne=function(){return JSON.parse(localStorage.getItem("pmap:publicFolders"))},ae=function(e){Object(u.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(e=t.call.apply(t,[this].concat(o))).state={privateFolderVisible:!0,publicFolders:[]},e.handleChange=function(t){var n=t.target.checked;e.updatePrivateFolderVisible(n),p.a.publish(n?ge:ve,{folderId:"__privateFolderId__"})},e.addSubscribers=function(){e.openDrawerToken=p.a.subscribe("publicfolder.add",e.addPublicFolderSubscriber)},e.removeSubscribers=function(){p.a.unsubscribe(e.openDrawerToken)},e.addPublicFolderSubscriber=function(t,n){e.addPublicFolder(n)},e.updatePrivateFolderVisible=function(t){e.setState({privateFolderVisible:t}),localStorage.setItem("pmap:privateFolderVisible",t)},e.addPublicFolder=function(t){var n=e.state.publicFolders,a=[].concat(Object(I.a)(n),[t]);e.setState({publicFolders:a}),localStorage.setItem("pmap:publicFolders",te(a))},e.updatePublicFolderVisiable=function(t,n){var a=e.state.publicFolders,r=Object(I.a)(a);r.forEach((function(e,a){e.folderId===t&&(r[a]=Object(Q.a)({},e,{visible:n}))})),e.setState({publicFolders:r}),localStorage.setItem("pmap:publicFolders",te(r))},e.updateMarkersVisible=function(e,t){p.a.publish(e?ge:ve,{folderId:t})},e.removePublicFolder=function(t){e.setState((function(e){var n=e.publicFolders.filter((function(e){return e.folderId!==t}));return localStorage.setItem("pmap:publicFolders",te(n)),{publicFolders:n}}))},e.removeMarkersInFolder=function(e){p.a.publish(he,{folderId:e})},e.renderPublicFolders=function(){var t=e.state.publicFolders;return 0===t.length?"No data":t.map(e.renderPublicFolder)},e.renderPublicFolder=function(t){var n=t.folderId;return r.a.createElement("div",{key:t.folderId},r.a.createElement($.a,{checked:t.visible,onChange:function(t){e.updatePublicFolderVisiable(n,t.target.checked),e.updateMarkersVisible(t.target.checked,n)}},t.folderName," : ",t.folderId," ",r.a.createElement(X.a,{title:"Are you sure delete this folder?",onConfirm:function(){e.removePublicFolder(n),e.removeMarkersInFolder(n)},onCancel:function(){},okText:"Yes",cancelText:"No"},r.a.createElement(w.a,{size:"small",type:"danger"},"Del"))))},e}return Object(s.a)(n,[{key:"componentDidMount",value:function(){this.addSubscribers(),this.setState({privateFolderVisible:"true"===localStorage.getItem("pmap:privateFolderVisible")})}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){return ee("render()",this.props,this.state),r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement("h3",null,"Private folder in Google Drive"),r.a.createElement($.a,{checked:this.state.privateFolderVisible,onChange:this.handleChange},'"Photo Map" folder in Google Drive of the login user')),r.a.createElement("div",null,r.a.createElement("h3",null,"Public folder in Google Drive"),this.renderPublicFolders()))}}]),n}(a.Component),re=function(){var e=Object(h.a)(b.a.mark((function e(t){var n,a;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,L(t);case 2:return n=e.sent,e.next=5,P(t);case 5:if(!(a=e.sent).error){e.next=9;break}throw console.error("Failed to get photos in a public folders, response:",a),new Error(a.error.message);case 9:return e.abrupt("return",{files:a.files,visible:!0,folderId:t,folderName:n.name});case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),oe=function(){var e=Object(h.a)(b.a.mark((function e(){var t;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=JSON.parse(localStorage.getItem("pmap:publicFolders"))){e.next=3;break}return e.abrupt("return",[]);case 3:return e.next=5,Promise.all(Object.keys(t).map(function(){var e=Object(h.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,re(t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ie=function(){var e=Object(h.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return p.a.publish(me,{files:t,visible:"true"===localStorage.getItem("pmap:privateFolderVisible"),folderId:"__privateFolderId__"}),e.next=3,oe();case 3:e.sent.forEach((function(e){return p.a.publish(me,e)}));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),le=S()("photo-map:src/Application/Map/index.jsx"),se={latitude:39.871446,longitude:116.215768},ce={lat:39.871446,lng:116.215768},ue="googlemap.fitmarkers",de=function(e){Object(u.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).handleMapChange=function(e){a.setMap(e)},a.handleRenderFinish=function(){a.setState({message:""})},a.handleLoginSuccess=function(){var e=Object(h.a)(b.a.mark((function e(t){var n,r,o,i;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return le("handleLoginSuccess",t),a.setState({message:"Login successfully, try to load photos in Google Drive..."}),e.next=4,D();case 4:return n=e.sent,a.setState({message:""}),r=!1,o=a.state.folders.map((function(e){return"__privateFolderId__"===e.folderId&&(r=!0,e.files=n),e})),r||o.push({folderId:"__privateFolderId__",files:n}),a.setState({folders:o}),e.next=12,oe();case 12:if(i=e.sent,a.setState({folders:[].concat(Object(I.a)(a.state.folders),Object(I.a)(i))}),i.forEach((function(e){p.a.publish("publicfolder.add",e)})),"amap"!==a.state.selectedMap){e.next=18;break}return e.next=18,ie(n);case 18:p.a.publish(ue);case 19:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),a.handleAMapInstanceCreated=function(){le("handleAMapInstanceCreated()",window.AMap),a.setState({amapLoaded:!0})},a.handleSignedOut=function(){a.setState({folders:[]}),p.a.publish(be)},a.handleDrawerOpen=function(){p.a.publish(De)},a.addSubscribers=function(){a.switchMapToken=p.a.subscribe("map.switchmap",a.switchMapSubscriber),a.showMarkersToken=p.a.subscribe("amap.showmarkers",a.showMarkersSubscriber),a.hideMarkersToken=p.a.subscribe("amap.hidemarkers",a.hideMarkersSubscriber)},a.removeSubscribers=function(){p.a.unsubscribe(a.switchMapToken)},a.switchMapSubscriber=function(){a.setMap("amap"===a.state.selectedMap?"google":"amap")},a.showMarkersSubscriber=function(e,t){a.updateMarkersInFolderVisible(t.folderId,!0)},a.hideMarkersSubscriber=function(e,t){a.updateMarkersInFolderVisible(t.folderId,!1)},a.updateMarkersInFolderVisible=function(e,t){var n=a.state.folders.map((function(n){return n.folderId===e&&(n.visible=t),n}));a.setState({folder:n})},a.setMap=function(e){a.setState({selectedMap:e}),localStorage.setItem("pmap::selectedMap",e)},a.state={folders:[],amapLoaded:!1,message:"Rendering Google login button..."},a.state.selectedMap=localStorage.getItem("pmap::selectedMap")||"amap",a}return Object(s.a)(n,[{key:"componentDidMount",value:function(){this.addSubscribers()}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){var e=this.state,t=e.selectedMap,n=e.folders,a=e.message,o=null;return"amap"===t?o=r.a.createElement(ke,{defaultCenter:se,defaultZoom:16,onMapInstanceCreated:this.handleAMapInstanceCreated}):"google"===t&&(o=r.a.createElement(K,{defaultZoom:16,defaultCenter:ce,markers:[],folders:n})),r.a.createElement("div",{className:"map-wrapper"},r.a.createElement(T,{message:a}),o,r.a.createElement("div",{className:"menu-btn-wrapper"},r.a.createElement(w.a,{onClick:this.handleDrawerOpen},"Menu")),r.a.createElement(Te,{selectedMap:t,onRenderFinish:this.handleRenderFinish,onLoginSuccess:this.handleLoginSuccess,onSignedOut:this.handleSignedOut,onMapChange:this.handleMapChange}))}}]),n}(a.Component),pe=function(e,t){var n=[];return e.getAllOverlays("marker").forEach((function(e){e.getExtData().folderId===t&&n.push(e)})),n},fe=(n(500),S()("photo-map:src/Application/Map/AMap/index.jsx")),me="amap.addmarkers",be="amap.removeallmarkers",he="amap.removemarkersinfolder",ge="amap.showmarkers",ve="amap.hidemarkers",ke=function(e){Object(u.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).map=null,e.allMarkers=[],e.addSubscribers=function(){e.addMarkersToken=p.a.subscribe(me,e.addMarkersSubscriber),e.removeAllMarkersToken=p.a.subscribe(be,e.removeAllMarkersSubscriber),e.removeMarkersInFolderToken=p.a.subscribe(he,e.removeMarkersInFolderSubscriber),e.showMarkersToken=p.a.subscribe(ge,e.showMarkersSubscriber),e.hideMarkersToken=p.a.subscribe(ve,e.hideMarkersSubscriber),e.fitMarkersToken=p.a.subscribe(ue,e.fitMarkersSubscriber)},e.removeSubscribers=function(){p.a.unsubscribe(e.addMarkersToken),p.a.unsubscribe(e.removeAllMarkersToken),p.a.unsubscribe(e.removeMarkersInFolderToken),p.a.unsubscribe(e.showMarkersToken),p.a.unsubscribe(e.hideMarkersToken)},e.addMarkersSubscriber=function(t,n){e.addMarkers(n.files,n.visible,n.folderId)},e.removeMarkersInFolderSubscriber=function(t,n){e.removeMarkersInFolder(n.folderId)},e.removeAllMarkersSubscriber=function(t){e.removeAllMarkers()},e.showMarkersSubscriber=function(t,n){e.updateMarkersInFolderVisible(n.folderId,!0)},e.hideMarkersSubscriber=function(t,n){e.updateMarkersInFolderVisible(n.folderId,!1)},e.fitMarkersSubscriber=function(t){e.map?e.map.setFitView():console.error("this.map of AMap is undefined!")},e.updateMarkersInFolderVisible=function(t,n){pe(e.map,t).forEach((function(e){n?e.show():e.hide()})),e.map.setFitView()},e.genMarker=function(t,n,a){return new window.AMap.Marker({map:e.map,visible:a,position:t.lnglat,icon:new window.AMap.Icon({size:new window.AMap.Size(64,64),image:t.thumbnail,imageSize:new window.AMap.Size(64,64)}),extData:{folderId:n}})},e.addMarkers=function(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=arguments.length>2?arguments[2]:void 0;if(window.AMap){var r=[];t.forEach((function(e){r.push([e.imageMediaMetadata.location.longitude,e.imageMediaMetadata.location.latitude])})),fe("window.AMap.convertFrom() loading"),window.AMap.convertFrom(r,"gps",(function(r,o){(fe("window.AMap.convertFrom",r,o),"ok"===o.info)&&(o.locations.map((function(e,n){return{lnglat:e,thumbnail:t[n].thumbnailLink,webViewLink:t[n].webViewLink}})).forEach((function(t){var r=e.genMarker(t,a,n);r.content='<div><a target="_blank" href="'.concat(t.webViewLink,'"><img src="').concat(t.thumbnail,'"></a></div>'),e.allMarkers.push(r);r.on("click",(function(t){var n=new window.AMap.InfoWindow({offset:new window.AMap.Pixel(0,-30)});n.setContent(t.target.content),n.open(e.map,t.target.getPosition())}))})),e.map.setFitView())}))}else alert("We are about to convert location from GPS to AMap, but AMap still not loaded!")},e.removeMarkersInFolder=function(t){var n=[];e.map.getAllOverlays("marker").forEach((function(e){e.getExtData().folderId===t&&n.push(e)})),e.map.remove(n)},e.removeAllMarkers=function(){e.map.remove(e.allMarkers)},e}return Object(s.a)(n,[{key:"componentDidMount",value:function(){this.addSubscribers()}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){var e=this,t=this.props,n=t.defaultCenter,a=t.defaultZoom,o={created:function(t){e.props.onMapInstanceCreated(t),e.map=t},click:function(e){fe("AMap event: click",e);var t=e.lnglat;console.log("You click on the AMap, lngLat: ".concat(t.toString()))}};return r.a.createElement("div",{className:"amap-wrapper"},r.a.createElement(F.Map,{amapkey:"2af81967e36bb62f50534e7b5c530ff9",version:"1.4.15",center:n,zoom:a,events:o}))}}]),n}(a.Component),we=n(522),Me=S()("photo-map:src/Application/MapSelector.jsx"),Se={display:"block",height:"30px",lineHeight:"30px"};function Ee(e){Me("render()");var t=e.selectedMap;return r.a.createElement("div",{className:"map-selector"},r.a.createElement("h3",null,"Choose Map:"),r.a.createElement(we.a.Group,{onChange:function(t){var n=t.target.value;e.onChange&&e.onChange(n)},value:t},r.a.createElement(we.a,{style:Se,value:"amap"},"AMap"),r.a.createElement(we.a,{style:Se,value:"google"},"Google Maps")))}var ye=function(e){Object(u.a)(n,e);var t=Object(c.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){return r.a.createElement("span",null,"Photo Map"," ",r.a.createElement(O,null,r.a.createElement("div",null,"Please read the"," ",r.a.createElement(f.a.OutboundLink,{eventLabel:"HowToUse",to:"https://github.com/photo-map/photo-map.github.io/blob/master/help/HOW_TO_USE.md#how-to-use",target:"_blank"},"How to use")," ","document in GitHub repo.")))}}]),n}(a.Component),Oe=S()("photo-map:src/Application/helpers/renderGoogleLoginBtn.js");var Fe=S()("photo-map:src/Application/MenuDrawer/GoogleLogin.jsx"),Ie=["profile","email","https://www.googleapis.com/auth/drive"].join(" "),je=function(e){Object(u.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,o=new Array(a),i=0;i<a;i++)o[i]=arguments[i];return(e=t.call.apply(t,[this].concat(o))).state={gapiAuth2Loaded:!1,signedIn:!1},e.handleSignOutBtnClick=function(){window.gapi.auth2.getAuthInstance().signOut().then((function(){Fe("User signed out by clicking button."),f.a.event({category:"Auth",action:"User logout"}),e.setState({signedIn:!1}),e.props.onSignedOut()}))},e.renderLoginBtn=function(){var e=window.gapi.auth2.getAuthInstance();return e&&e.isSignedIn.get()?null:r.a.createElement("div",{id:"custom-google-login-button"})},e.renderSignOutBtn=function(){return e.state.signedIn?r.a.createElement("button",{onClick:e.handleSignOutBtnClick},"Sign out"):null},e}return Object(s.a)(n,[{key:"componentDidMount",value:function(){var e=this;window.gapi.load("auth2",(function(){Fe("auth2 loaded"),e.setState({gapiAuth2Loaded:!0});var t=window.gapi.auth2.init({client_id:"769870583187-6p6tvl5nh7qc8m9hrgqh285siqm9oc37.apps.googleusercontent.com",scope:Ie});!function(e,t){Oe("renderGoogleLoginBtn()",e,t),t.attachClickHandler("custom-google-login-button",{},(function(t){Oe("onSuccess()",t),Oe("User signed in by clicking button."),f.a.event({category:"Auth",action:"User login"}),e.onLoginSuccess(t)}),(function(e){Oe("onFailure(), error:",e)})),t.isSignedIn.listen((function(e){Oe("signinChanged()",e)})),t.currentUser.listen((function(e){Oe("userChanged()",e)})),window.gapi.load("signin2",(function(){Oe("signin2 loaded");window.gapi.signin2.render("custom-google-login-button",{onsuccess:function(t){Oe("handleSuccess()",t),Oe("User already signed in when rendering button."),e.onLoginSuccess(t)},onfailure:function(e,t,n){Oe("handleFailure",e,t,n)}}),e.onRenderFinish()}))}({onLoginSuccess:function(t){e.setState({signedIn:!0}),e.props.onLoginSuccess(t)},onRenderFinish:e.props.onRenderFinish},t)}))}},{key:"render",value:function(){return this.state.gapiAuth2Loaded?r.a.createElement("div",null,r.a.createElement("h3",null,"Google Login"),this.renderLoginBtn(),this.renderSignOutBtn()):r.a.createElement("div",null,'The "auth2" gapi library doesn\'t loaded yet.')}}]),n}(a.Component),Ce=n(87),xe=function(e){return e.replace("https://drive.google.com/drive/folders/","").replace("?usp=sharing","")},Ae=function(e){var t,n=(t={},Object(Ce.a)(t,"pmap:privateFolderVisible",e.getItem("pmap:privateFolderVisible")),Object(Ce.a)(t,"pmap:publicFolders",e.getItem("pmap:publicFolders")),Object(Ce.a)(t,"pmap::selectedMap",e.getItem("pmap::selectedMap")),t);return"data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(n,null,2))},Le=function(e,t){e.setItem("pmap:privateFolderVisible",t["pmap:privateFolderVisible"]),e.setItem("pmap:publicFolders",t["pmap:publicFolders"]),e.setItem("pmap::selectedMap",t["pmap::selectedMap"])},Pe=function(e){Object(u.a)(n,e);var t=Object(c.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).handleDownload=function(){a.setState({href:Ae(localStorage)},(function(){a.downloadRef&&a.downloadRef.current?a.downloadRef.current.click():alert("downloadRef or node is undefined!")}))},a.handleImport=function(){a.inputRef&&a.inputRef.current?a.inputRef.current.click():alert("inputRef or node is undefined!")},a.handleChange=function(){var e=Object(h.a)(b.a.mark((function e(t){var n,a,r;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=t.target.files[0])){e.next=7;break}return e.next=4,new Response(n).text();case 4:a=e.sent,r=JSON.parse(a),Le(localStorage,r);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),a.downloadRef=r.a.createRef(),a.inputRef=r.a.createRef(),a.state={href:"{}"},a}return Object(s.a)(n,[{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("h3",null,"Import/Export application config"),r.a.createElement("a",{ref:this.downloadRef,href:this.state.href,style:{display:"none"},download:"photo-map-config.json"},"Download Config File"),r.a.createElement(w.a,{onClick:this.handleDownload},"Export"),r.a.createElement("input",{ref:this.inputRef,className:"import-config-file-helper",type:"file",style:{display:"none"},onChange:this.handleChange}),r.a.createElement(w.a,{onClick:this.handleImport},"Import"))}}]),n}(a.Component),Ve=S()("photo-map:src/Application/MenuDrawer/index.jsx"),De="menudrawer.open",Te=function(e){Object(u.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={drawerVisible:!1,publicFolderLink:"",loading:!1},e.handleDrawerClose=function(){e.setVisible(!1)},e.handlePublicFolderLinkChange=function(t){e.setState({publicFolderLink:t.target.value})},e.handlePublicFolderInputPressEnter=function(){e.loadPublicFolderAndAddMarkers()},e.handleLoadPublicFolderBtnClick=function(){e.loadPublicFolderAndAddMarkers()},e.loadPublicFolderAndAddMarkers=Object(h.a)(b.a.mark((function t(){var n,a;return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e.state.loading){t.next=3;break}return g.b.warn("Previous public folder is loading now, please wait a moment."),t.abrupt("return");case 3:if(n=xe(e.state.publicFolderLink),void 0===ne()[n]){t.next=7;break}return g.b.warn("There is an existing public folder!"),t.abrupt("return");case 7:return a=null,t.prev=8,e.setState({loading:!0}),t.next=12,re(n);case 12:a=t.sent,e.setState({loading:!1}),t.next=22;break;case 16:return t.prev=16,t.t0=t.catch(8),console.error("failed to get photos in a public folder, error:",t.t0),g.b.error(t.t0.message),e.setState({loading:!1}),t.abrupt("return");case 22:p.a.publish("publicfolder.add",a),p.a.publish(me,a);case 24:case"end":return t.stop()}}),t,null,[[8,16]])}))),e.setVisible=function(t){e.setState({drawerVisible:t})},e.openDrawerSubscriber=function(t){e.setVisible(!0)},e.openCloseDrawerSubscriber=function(t){e.setVisible(!e.state.drawerVisible)},e.addSubscribers=function(){e.openDrawerToken=p.a.subscribe(De,e.openDrawerSubscriber),e.openCloseDrawerToken=p.a.subscribe("menudrawer.openclose",e.openCloseDrawerSubscriber)},e.removeSubscribers=function(){p.a.unsubscribe(e.openDrawerToken)},e}return Object(s.a)(n,[{key:"componentDidMount",value:function(){this.addSubscribers()}},{key:"componentWillUnmount",value:function(){this.removeSubscribers()}},{key:"render",value:function(){Ve("render()");var e=this.props.selectedMap,t=this.state,n=t.drawerVisible,a=t.publicFolderLink;return r.a.createElement("div",{className:"menu-drawer"},r.a.createElement(v.a,{className:"menu-drawer",width:512,title:r.a.createElement(ye,null),placement:"left",closable:!1,forceRender:!0,visible:n,onClose:this.handleDrawerClose},r.a.createElement(Ee,{selectedMap:e,onChange:this.props.onMapChange}),r.a.createElement(je,{onLoginSuccess:this.props.onLoginSuccess,onRenderFinish:this.props.onRenderFinish,onSignedOut:this.props.onSignedOut}),r.a.createElement("div",null,r.a.createElement("div",null,"Public folder link:"," ",r.a.createElement(O,null,r.a.createElement("div",null,r.a.createElement("div",null,"Please fill the public folder link. For example:"),r.a.createElement("div",null,"https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing")))),r.a.createElement(k.a,{value:a,onChange:this.handlePublicFolderLinkChange,onPressEnter:this.handlePublicFolderInputPressEnter}),r.a.createElement(w.a,{disabled:this.state.loading,onClick:this.handleLoadPublicFolderBtnClick},"Load"),r.a.createElement("hr",null),r.a.createElement(ae,null),r.a.createElement("hr",null),r.a.createElement(Pe,null))))}}]),n}(a.Component),Re=function(){f.a.initialize("UA-48270916-5",{})},Ge=function(){document.addEventListener("keyup",(function(e){switch(e.code){case"KeyM":p.a.publish("menudrawer.openclose");break;case"KeyS":p.a.publish("map.switchmap")}}),!1)},_e=function(){return new Promise((function(e,t){window.gapi.load("client",(function(){e()}))}))};function Ne(){return r.a.createElement("div",{className:"website-warning"},r.a.createElement("p",null,"Google API not loaded!"),r.a.createElement("p",null,"Maybe you need to turn off the Adblock Plus for this website."),r.a.createElement("p",null,"If you still have problem, please"," ",r.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://github.com/photo-map/photo-map.github.io/issues"},"raise an issue")," ","in the GitHub project."))}n(515),n(516);var Ue=function(e){Object(u.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={gapiLoaded:!1,gapiClientLoading:!1},e.initApplication=function(){Re(),window.gapiLoadedFlag&&(e.setState({gapiLoaded:!0}),e.loadGapiClient()),Ge()},e.loadGapiClient=function(){e.setState({gapiClientLoading:!0}),_e().then((function(){e.setState({gapiClientLoading:!1})}))},e}return Object(s.a)(n,[{key:"componentDidMount",value:function(){this.initApplication()}},{key:"render",value:function(){return this.state.gapiLoaded?this.state.gapiClientLoading?r.a.createElement("div",null,"gapi client lib is loading"):r.a.createElement("div",{className:"application"},r.a.createElement(de,null)):r.a.createElement(Ne,null)}}]),n}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(Ue,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[256,1,2]]]);
//# sourceMappingURL=main.213939cb.chunk.js.map