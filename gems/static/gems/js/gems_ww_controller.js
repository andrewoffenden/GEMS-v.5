
/*
    *gems_WW_controller.js
      
  
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
class GemsWWController 
{
    //TODO:: if any other web worker need arises superclass this, to allow extension for specific needs.
    constructor()
    {
        this.events = new Map();
        this.response_classes = new Map();
    }
    registerEvent(target_id,script_path,ww_context)
    {        
        let worker = new Worker(script_path);

        var response_class = eval("GemsReport" + target_id.slice(4));
        response_class = new response_class();

        worker.parent = this;
        worker.context = ww_context;

        worker.onmessage = function(event) {
            //check if target div exists, if not close worker and return.
            if (!document.getElementById(target_id)) {
                this.parent.closeEvents();
                return;
            }
            if (document.getElementById(target_id).style.display == "none") {
                //if the toggle is closed close event
                this.parent.closeEvent(target_id);
                return;
            } else {
                let response_class = this.parent.response_classes.get(target_id);

                //assign to response class response_data attribute.
                response_class.updateHTML(event.data);
                response_class.clearTarget();
                response_class.display();
            }
        }

        this.response_classes.set(target_id, response_class);
        this.events.set(target_id,worker);

        worker.postMessage(worker.context);
    }
    closeEvent(target_id)
    {
        this.events.get(target_id).terminate();
        this.events.delete(target_id);

        this.response_classes.delete(target_id);
    }
    closeEvents()
    {
        for (const [key,value] of this.events) {
            this.events.get(key).terminate();
            this.events.delete(key);          
        }
        for (const [key,value] of this.response_classes) {
            this.response_classes.delete(key);          
        }
    }

}




