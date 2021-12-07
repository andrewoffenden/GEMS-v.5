
/*
    *gems_lib.js
      
  
    * copyright 2020 Douglas Post and David A. Woffenden 
    * 
    * many of the lines of code were written by Douglas Post, from his Simple Social
    * software and used here.
    *
    * This program is free software; you can redistribute it and/or modify
    * it under the terms of the GNU General Public License as published by
    * the Free Software Foundation; either version 2 of the License, or
    * (at your option) any later version.
    * but WITHOUT ANY WARRANTY; without even the implied warranty of
    * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    * GNU General Public License for more details.
    * 
    * You should have received a copy of the GNU General Public License
    * along with this program; if not, write to the Free Software
    * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
    * MA 02110-1301, USA.
    * 
    * 

    Class used in dynamic construction of gems modal prompt.
        1. Composed by GemsRequestController

*/
function gemsToggleCheckbox(check_box)
{
    //my own checkbox!
    let class_list = check_box.classList;

    if(class_list.contains("gems-checkbox-off")) {
        class_list.remove("gems-checkbox-off",  "fa-circle");
        class_list.add("gems-checkbox-on","fa-check-circle");
        check_box.dataset.status = "True";
    }
    else {
        class_list.remove("gems-checkbox-on","fa-checkbox-circle");
        class_list.add("gems-checkbox-off","fa-circle");
        check_box.dataset.status = "False";
    }
}

function setCookie(cname, cvalue, exdays) 
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
  }
  return "";
}

/*
    function toggleGemsWorker:
        A) params:
            1. target_id:  id tag of the desired target for the web workers response data.  
            2. script_path:  path to the script for the web worker
        B) on toggle open initiates gems worker to update contents of panel, on toggle closed closes the worker thread
*/
function toggleGemsWorker(target_id, script_path, context)
{
    let class_list = context["toggle_state"];
    let ww_context = context["ww_context"];

    if (class_list.contains("gems_toggle_off")) {
        //toggle class list
        class_list.remove("gems_toggle_off");
        class_list.add("gems_toggle_on");
        
        //start web worker 
        try {
            if(!gems_controller.requests.has("GemsReqDisplayStudent")) {
                throw ReferenceError;
            }
            gems_controller.requests.get("GemsReqDisplayStudent").gemsWW.registerEvent(target_id, script_path, ww_context);
        } catch(error) {
            console.log(error);
            //window.location = ".";
        }
    }
    else {
        //toggle class list 
        class_list.remove("gems_toggle_on");
        class_list.add("gems_toggle_off");
        
        try {
            gems_controller.requests.get("GemsReqDisplayStudent").gemsWW.closeEvent(target_id);
        } catch(error) {
            console.log(error);
        } 
    }
}
/* Below is the function for opening the tabs in the reports */
function gemsOpenReport(evt,reportlist) {
	var i,x,tablinks;
	x = document.getElementsByClassName('reportlist');
	for(i = 0; i < x.length; i++) {
		x[i].style.display = 'none';
	}
	tablinks = document.getElementsByClassName('reporttablink');
	for(i = 0; i < x.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" w3-theme-l1","");
	}
	document.getElementById(reportlist).style.display = 'block';
	evt.currentTarget.className += " w3-theme-l1";
}
/*
    Used in xhr_controller.  Takes an xhttp response object and creates an object URL
    in order to download the contents.  Use case for csv download etc.
*/
function downloadCsv(xhttp) {
       var blob = new Blob([xhttp.responseText]);
       var a = window.document.createElement("a");
       a.href = window.URL.createObjectURL(blob, {
           type: "text/plain"
       });
       a.download = xhttp.getResponseHeader('Content-Disposition');
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
}
function gemsUpdateThemePreview(theme)
{
    let frame = document.getElementById("gems_theme_preview")
    
    frame.src = 'GemsReqPreviewTheme/{"theme":"'+theme+'"}';
}
function gemsUpdateAvatarPreview(avatar)
{
        avatar_preview = document.getElementById("gems_avatar_preview");
        
        avatar_preview.src = "/static/gems/img/avatar/" + avatar;
}
