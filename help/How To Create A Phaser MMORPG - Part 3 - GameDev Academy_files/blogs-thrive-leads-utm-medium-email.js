(()=>{document.addEventListener('DOMContentLoaded',(event)=>{var urlParams=new URLSearchParams(window.location.search);if(urlParams.get('utm_medium')==='email'||getCookie('zva_email_visitor')){setCookie('zva_email_visitor','true');observeDOMChanges();}});function setCookie(name,value){document.cookie=name+"="+(value||"")+"; path=/";}
function getCookie(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)===' '){c=c.substring(1,c.length);}
if(c.indexOf(nameEQ)===0){return c.substring(nameEQ.length,c.length);}}
return null;}
function zva_hide_thriveleads(){const classesToDelete=['tve-fe-message','tl-states-root','tve-leads-screen-filler','tvd-toast'];let elementsFound=false;classesToDelete.forEach((className)=>{var elements=document.getElementsByClassName(className);while(elements.length>0){elements[0].parentNode.removeChild(elements[0]);}});if(elementsFound){observer.disconnect();}}
let observer;function observeDOMChanges(){observer=new MutationObserver(()=>{zva_hide_thriveleads();});observer.observe(document.body,{childList:true,subtree:true});}})();