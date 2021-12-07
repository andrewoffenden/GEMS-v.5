/*

    *gems_ww_test_history.js
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
    * This script is executed by a web worker.  It updates the student
    * info page's class info section with the classes the student is currently
    * enrolled in.
*/
var student_id;
var response;
var TIMEOUT = 5000;

// need student idoc
self.onmessage =  function(event) {
    student_id = JSON.stringify({"student_id":event.data});
    updatePage();
};

function updatePage() {
    fetch(location.origin+'/GemsReqTestHistory/'+self.student_id).then(resp=>resp.json()).then(json=>{postMessage(json)});
    // postMessage(response);
    setTimeout("updatePage()", TIMEOUT);
}

