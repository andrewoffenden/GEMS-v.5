/*

    *gems_ww_web_attendance.js
    * 
    *
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
    * Information:
    * 
    * This script is executed by a web worker.
    * It updates the gems web attendance page's hourly scan table.
*/
var context;
var response;
var TIMEOUT = 2000;

// class and day remain the same throughout lifetime of web_worker
self.onmessage = function (event) {
    context = {
        "classroom": event.data["classroom"],
        "day": event.data["day"],
    };
    updatePage();
};

function updatePage() {
    self.context["hour"] = new Date().getHours();
    
    fetch(location.origin + '/GemsWebAttendance/GemsReqUpdateWebAttendance/' + JSON.stringify(self.context)).then(resp => resp.json()).then(json => {
        postMessage(json);
    });

    setTimeout("updatePage()", TIMEOUT);
}
