/*
    *gems_XHR_controller.js
      
  
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
*/

class GemsXHRController 
{
    constructor()
    {
        //allow method chaining.
        return this;
    }
    
    /*
    used for simple GET requests that are not a part of the normal flow of a GemsRequest.
    request_data param is a java script object of parameters that will be stringified.
    these requests are synchronous, to avoid issues with assignment to this.request_data of
    the request controller class.

    TODO:: possibly re-work this. currently this assigns to the requesting class' prompt_data attribute, as this function
          will likely be used in a limited capacity to update prompts dynamically.
    */

    getCSRFToken()
    {
        let csrf_token =  getCookie("csrftoken");
        return csrf_token
    }

    gemsXHR(method,url,request_data, finalize_request=false,request_class) 
    {

        //request_class = request_class.toString();
        var xhttp = new XMLHttpRequest();
        var jsonstr = JSON.stringify(request_data);
        
        xhttp.onreadystatechange = function() 
        {
            if (this.readyState === 4 && this.status === 200)
               
                if (this.responseText) {    
                        if (this.getResponseHeader('Content-Type') === "text/csv") {
                            //if the content-type is a csv request download of file.
                            downloadCsv(this);
                        }
                        else {
                            //all other cases thus far will be json response from server.
                            let response_data = JSON.parse(this.responseText);
                            gems_controller.requests.get(request_class).response_data = response_data;
                        }
                    if(finalize_request) {
                        //call the finalizeRequest method of the GemsRequest instance.
                        gems_controller.requests.get(request_class).finalizeRequest();
                    }
                    else {
                        //if no callback required simply return the json string so both are available TODO::remove debug.
                        gems_controller.requests.get(request_class).reclaim_request = true;
                    }
                }
        }
        switch (method.toUpperCase()) {
            case 'GET':
                xhttp.open(method, url+"/"+jsonstr, true);
                xhttp.setRequestHeader("Content-type","application/json");
                xhttp.send(null);
                break;

            case 'POST':
                //if request data is a json string append to url, else send in body of request
                let csrf_token = this.getCSRFToken();

                xhttp.open(method,url);
                xhttp.setRequestHeader("Content-type","application/json");
                xhttp.setRequestHeader("X-CSRFToken", csrf_token);
                xhttp.send(jsonstr);
                break;
        }
    }
}


