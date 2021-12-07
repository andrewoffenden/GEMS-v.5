/*
    *gems_modal_view.js
      
  
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

//TODO::consider moving search prompt modals to another file, for organization.
class GemsPrompt
{
    /*
        Superclass contains static methods and properties that GemsPromptModal
        will use in it's construction.
    */
    constructor() 
    {    
     

    }
    display() 
    {
        //use this method to write to the dom
        document.getElementById("gems_main_div").insertAdjacentHTML("afterbegin",this.html);
    }
    destroy()
    {
        
        //$("#gems_main_div").empty();
        document.getElementById("gems_prompt").remove();
    }
}
class GemsPromptEditUserSearch extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
                                "prompt_header":"User Search",
                                "prompt_message":"Please search for the user you would like to edit.",
                                "prompt_id":"gems_prompt",
                                "results_id":"gems_prompt_search_results",
                                "modal_on_submit":"gems_controller.requests.get('GemsReqEditUserSearch').submitRequest();",
                                "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
                                 
                            };
                            this.html = `
                            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                                <div class="w3-modal-content w3-theme-l5 w3-card">
                                        <header class="w3-theme-d3 w3-content ">
                                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                        </header>
                                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="">
                                                ${this.modal_params["prompt_message"]} 
                                            </div>
                                            <div class="w3-row-padding w3-margin-bottom">
                                            <div class="w3-half"><input class="w3-input" id = "gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}" placeholder="Search..." ></input></div>
                                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                                  <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                                            </div>
                                            <div id=${this.modal_params["results_id"]}>
            
                                            </div>
                                        </div>
                                </div>
                            </div>
                                `;
        return this;
    }
}
class GemsPromptResetPasswordSearch extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header":"User Search",
            "prompt_message":"Please select a user whose password you would like to reset.",
            "prompt_id":"gems_prompt",
            "results_id":"gems_prompt_search_results",
            "modal_on_submit":"gems_controller.requests.get('GemsReqResetPasswordSearch').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
             
        };
        this.html = `
            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card">
                        <header class="w3-theme-d3 w3-content ">
                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                        </header>
                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="">
                                ${this.modal_params["prompt_message"]} 
                            </div>
                            <div class="w3-row-padding w3-margin-bottom">
                            <div class="w3-half"><input class="w3-input" id ="gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}"  placeholder="Search..." ></input></div>
                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                            </div>
                            <div id=${this.modal_params["results_id"]}>

                            </div>
                        </div>
                </div>
            </div>
            `;
    return this;
    }
}
class GemsPromptModUserSGSearch extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header":"User Search",
            "prompt_message":"Please select a user whose security group you would like to change.",
            "prompt_id":"gems_prompt",
            "results_id":"gems_prompt_search_results",
            "modal_on_submit":"gems_controller.requests.get('GemsReqModUserSGSearch').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
             
        };
        this.html = `
            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card">
                        <header class="w3-theme-d3 w3-content ">
                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                        </header>
                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="">
                                ${this.modal_params["prompt_message"]} 
                            </div>
                            <div class="w3-row-padding w3-margin-bottom">
                            <div class="w3-half"><input class="w3-input" id = "gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}"  placeholder="Search..." ></input></div>
                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                            </div>
                            <div id=${this.modal_params["results_id"]}>

                            </div>
                        </div>
                </div>
            </div>
            `;
    return this;
    }
}
class GemsPromptDelUserSearch extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header":"User Search",
            "prompt_message":"Please select a user whose entry you would like to delete.",
            "prompt_id":"gems_prompt",
            "results_id":"gems_prompt_search_results",
            "modal_on_submit":"gems_controller.requests.get('GemsReqDelUserSearch').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
             
        };
        this.html = `
            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card">
                        <header class="w3-theme-d3 w3-content ">
                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                        </header>
                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" >
                                ${this.modal_params["prompt_message"]} 
                            </div>
                            <div class="w3-row-padding w3-margin-bottom">
                            <div class="w3-half"><input class="w3-input" id = "gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}"  placeholder="Search..." ></input></div>
                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                            </div>
                            <div id=${this.modal_params["results_id"]}>

                            </div>
                        </div>
                </div>
            </div>
            `;
    return this;
    }
}
class GemsPromptEditStudentSearch extends GemsPrompt 
{
    constructor() {
        super();
        this.modal_params = {
            "prompt_header": "Student Search",
            "prompt_message": "Please search for the student you would like to edit.",
            "prompt_id": "gems_prompt",
            "results_id": "gems_prompt_search_results",
            "modal_on_submit": "gems_controller.requests.get('GemsReqEditStudentSearch').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"

        };
        this.html = `
                            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                                <div class="w3-modal-content w3-theme-l5 w3-card">
                                        <header class="w3-theme-d3 w3-content ">
                                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                        </header>
                                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" >
                                                ${this.modal_params["prompt_message"]} 
                                            </div>
                                            <div class="w3-row-padding w3-margin-bottom">
                                            <div class="w3-half"><input class="w3-input" id = "gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}" placeholder="Search..." ></input></div>
                                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                                  <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                                            </div>
                                            <div id=${this.modal_params["results_id"]}>
            
                                            </div>
                                        </div>
                                </div>
                            </div>
                                `;
        return this;
    }
}
class GemsPromptDelStudentSearch extends GemsPrompt 
{
    constructor() {
        super();
        this.modal_params = {
            "prompt_header": "Student Search",
            "prompt_message": "Please search for the student you would like to remove.",
            "prompt_id": "gems_prompt",
            "results_id": "gems_prompt_search_results",
            "modal_on_submit": "gems_controller.requests.get('GemsReqDelStudentSearch').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"

        };
        this.html = `
                            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                                <div class="w3-modal-content w3-theme-l5 w3-card">
                                        <header class="w3-theme-d3 w3-content ">
                                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                        </header>
                                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" >
                                                ${this.modal_params["prompt_message"]} 
                                            </div>
                                            <div class="w3-row-padding w3-margin-bottom">
                                            <div class="w3-half"><input class="w3-input" id = "gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}" placeholder="Search..." ></input></div>
                                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                                  <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                                            </div>
                                            <div id=${this.modal_params["results_id"]}>
            
                                            </div>
                                        </div>
                                </div>
                            </div>
                                `;
        return this;
    }
}
//TODO:: make this extensible somehow, in order to not have to copy the modal html.
class GemsPromptInformation extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header":"Information",
            "prompt_id":"gems_prompt",
            "modal_on_submit":"",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
             
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                        <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <p>${this.prompt_data["message"]}</p>
                    </div>
                    <footer class='w3-container w3-center'>
                    <p><button id="gems_prompt_cancel" class="w3-button  w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">OK</button></p>
                    </footer>
                </div>
                </div>
            `;
    return this;
    }
}
class GemsPromptDisplayStudent extends GemsPrompt
{
    //generic test prompt
    constructor(prompt_data)
    {
        super();
        //this.request_class = request_class;
        this.prompt_data = prompt_data;
        this.modal_params={  "header":"Searching for Student...",
                            "prompt_id":"gems_prompt",
                            "fields":this.prompt_data,
                            "modal_on_submit":"",
                            "modal_on_cancel":"document.getElementById('gems_prompt').remove();"};
        this.html   =   ` 
                            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                            <div class="w3-modal-content w3-theme-l5 w3-card-4">
                            <header class="w3-container w3-theme-d3">
                                <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <table id="gems_student_table" class="w3-table-all w3-hoverable w3-margin-top">
                                <tr class="w3-theme-d1">
                                    <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                                    <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                                    <th>First Name</th><th>Unit</th><th>Institution</th><th>Date Entered</th>
                                </tr>
                                ${this.prompt_data.map(row => `<tr class="item"  onclick="gems_controller.initGemsRequest(GemsReqDisplayStudent,${row['IDOC']})"><td>${row['IDOC']}</td><td>${row['last_name']}</td>
                                <td>${row['first_name']}</td><td>${row['housing_unit']}</td><td>${row['institution']}</td><td>${row['entry_date']}</td></tr>`).join('')}
                            </table>
                            <footer class='w3-container w3-center'>
                                <p><button id="gems_prompt_cancel" class="w3-button  w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button></p>
                            </footer>
                            </div>
                            </div>
                            </div>
                        `;
    }
}
class GemsPromptAddEnrollmentRecord extends GemsPrompt
{
 constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Add Enrollment Record",
            "prompt_message": 'This is where you can enroll a student in an available class.  <br> In order to select more than one day or hour for enrollment simply hold the "shift" or "ctrl" key while you select.',
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAddEnrollmentRecord').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
            "modal_default_date": new Date().toISOString().slice(0, 10)
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                               
                                <div class="w3-content w3-margin" >
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30% ">Select an available class</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="class" style="width:60%">
                                        ${this.prompt_data["select_boxes"]["class"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="w3-content w3-margin" >
                                    <label class=" w3-left w3-theme-l1 w3-padding" style="width:30%" >Select one or more days</label>
                                        ${this.prompt_data["select_boxes"]["day"].map(row=>`
                                                <label>${row['name']}</label><i class="w3-hover-opacity w3-margin-right gems-checkbox-off fa fa-circle gems_user_input_check" data-status="False" style="margin-left:5px;font-size:18px;" data-key="${row['id']}" onclick="gemsToggleCheckbox(this)"></i>
                                            `).join('')}
                                </div>
                                <div class="w3-content w3-margin" >
                                    <label class=" w3-left w3-theme-l1 w3-padding" style="width:30%" >Select an hour</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="hour" style="width:60%;">
                                        ${this.prompt_data["select_boxes"]["hour"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                </div>
                                <input class="gems_user_input" style="display:none;" data-key="student_id" value="${this.prompt_data["student_id"]}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Enrollment Record</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptEditEnrollmentRecord extends GemsPrompt
{
    constructor(prompt_data) 
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Edit Enrollment Record",
            "prompt_message": "Edit the selected enrollment record and submit the results. <br>Warning: Any changes here will overwrite those currently set in the enrollment record.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqEditEnrollmentRecord').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
            "modal_default_date": new Date().toISOString().slice(0, 10)
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                               
                            <div class="w3-content w3-margin" >
                                <label class="w3-left w3-theme-l1 w3-padding" style="width:30% ">Select an available class</label>
                                <select class="w3-select w3-margin-left gems_user_input" data-key="class" style="width:60%">
                                    ${this.prompt_data["select_boxes"]["class"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                </select>
                            </div>
                            <div class="w3-content w3-margin" >
                                <label class=" w3-left w3-theme-l1 w3-padding" style="width:30%" >Select one or more days</label>
                                    ${this.prompt_data["select_boxes"]["day"].map(row=>`
                                            <label>${row['name']}</label><i class="w3-hover-opacity w3-margin-right gems-checkbox-off fa fa-circle gems_user_input_check" data-status="False" style="margin-left:5px;font-size:18px;" data-key="${row['id']}" onclick="gemsToggleCheckbox(this)"></i>
                                        `).join('')}
                            </div>
                            <div class="w3-content w3-margin" >
                                <label class=" w3-left w3-theme-l1 w3-padding" style="width:30%" >Select an hour</label>
                                <select class="w3-select w3-margin-left gems_user_input" data-key="hour" style="width:60%;">
                                    ${this.prompt_data["select_boxes"]["hour"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                </select>
                            </div>
                            <input class="gems_user_input" style="display:none;" data-key="student_id" value="${this.prompt_data["student_id"]}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit Enrollment Record</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptDelEnrollmentRecord extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete Enrollment Record",
                    "prompt_message":" Delete selected enrollment records from the database? <br> Warning: This will de-enroll the student from all days on this timeslot.",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqDelEnrollmentRecord').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
         this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class="w3-theme-l1 w3-margin-top w3-margin-bottom w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> 
                           Enrollment record: ${this.prompt_data["subject"]}  with  ${this.prompt_data["teacher"]} for ${this.prompt_data["hour"]} 
                        </div>
                        <input class="gems_user_input"  style="display:none" data-key="student_id" value="${this.prompt_data['student_id']}"></input>
                        <input class="gems_user_input"  style="display:none" data-key="class_timeslot_id" value="${this.prompt_data['class_timeslot_id']}"></input>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
                    
    }
}
class GemsPromptAddTestRecord extends GemsPrompt
{
 constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Add Test Record",
            "prompt_message": "This is where you register a students test score.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAddTestRecord').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
            "modal_default_date": new Date().toISOString().slice(0, 10)
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                               
                                <div class="w3-content w3-margin" >
                                    <label class=" w3-left w3-theme-l1 w3-padding" style="width:30%" >Select a Test</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="test" style="width:60%;">
                                        ${this.prompt_data["select_boxes"]["test"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="w3-content w3-margin">
                                    <label class="w3-left w3-theme-l1 w3-padding " style="width:30%;margin-right:50px">Test Score</label>
                                    <input class="w3-margin-left w3-input  gems_user_input" data-key="test_score" style="width:60%"></input>
                                </div>
                                
                                <div class="w3-content w3-margin" >
                                    <label class="w3-left w3-theme-l1 w3-padding " style="width:30%;margin-right:50px">Test Date</label>
                                    <input class=" w3-margin-left  w3-input gems_user_input" style="width:60%;" data-key="test_date" type="date" pattern="([1-2])([\d])([\d])([\d])([-])([0-1])([\d])([-])([0-3])([\d])" title="Please enter a date in the format of yyyy-mm-dd" autocomplete="off" value="${this.modal_params['modal_default_date']}" required></input>
                                </div>
                                <div class="w3-container">
                                    <label class="w3-left w3-theme-l1 w3-padding " style="width:30%;margin-right:50px">Certificate Printed?</label>
                                    <div class="w3-left gems-checkbox-container">
                                        <i class="w3-hover-opacity  gems-checkbox-off fa fa-circle gems_user_input_check" data-status="0" style="font-size:18px;" data-key="cert_printed" onclick="gemsToggleCheckbox(this)"></i>
                                    </div>
                                </div>
                                <input class="gems_user_input" style="display:none;" data-key="student_id" value="${this.prompt_data["student_id"]}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Test Record</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptEditTestRecord extends GemsPrompt
{
    constructor(prompt_data) 
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Edit Test Record",
            "prompt_message": "Edit the selected test record and submit the results.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqEditTestRecord').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
            "modal_default_date": new Date().toISOString().slice(0, 10)
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <div class="w3-content w3-margin" >
                                    <label class=" w3-left w3-theme-l1 w3-padding" style="width:30%" >Select a Test</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="test" style="width:60%;">
                                        ${this.prompt_data["select_boxes"]["test"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="w3-content w3-margin">
                                    <label class="w3-left w3-theme-l1 w3-padding " style="width:30%;margin-right:50px">Test Score</label>
                                    <input class="w3-margin-left w3-input  gems_user_input" data-key="test_score" style="width:60%"></input>
                                </div>
                                
                                <div class="w3-content w3-margin" >
                                    <label class="w3-left w3-theme-l1 w3-padding " style="width:30%;margin-right:50px">Test Date</label>
                                    <input class=" w3-margin-left  w3-input gems_user_input" style="width:60%;" data-key="test_date" type="date" pattern="([1-2])([\d])([\d])([\d])([-])([0-1])([\d])([-])([0-3])([\d])" title="Please enter a date in the format of yyyy-mm-dd" autocomplete="off" value="${this.modal_params['modal_default_date']}" required></input>
                                </div>
                                <div class="w3-container">
                                    <label class="w3-left w3-theme-l1 w3-padding " style="width:30%;margin-right:50px">Certificate Printed?</label>
                                    <div class="w3-left gems-checkbox-container">
                                        <i class="w3-hover-opacity  gems-checkbox-off fa fa-circle gems_user_input_check" data-status="0" style="font-size:18px;" data-key="cert_printed" onclick="gemsToggleCheckbox(this)"></i>
                                    </div>
                                </div>
                                <input class="gems_user_input" style="display:none;" data-key="id" value="${this.prompt_data["id"]}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit Test Record</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptDelTestRecord extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete Test Record",
                    "prompt_message":" Delete selected test record from the database?",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqDelTestRecord').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
         this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class="w3-theme-l1 w3-margin-top w3-margin-bottom w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> 
                            Test record: ${this.prompt_data["test"]}  with  ${this.prompt_data["test_score"]} on ${this.prompt_data["test_date"]} 
                        </div>
                        <input class="gems_user_input"  style="display:none" data-key="id" value="${this.prompt_data['id']}"></input>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
                    
    }
}
class GemsPromptAddStudentComment extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Add Student Comment",
            "prompt_message": "This is where you may add a useful comment about a student.<br>  These are intended to foster continuity in our interactions with students as they move between classrooms.  <br>  Note: A degree of professionalism is expected as these comments logged.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAddStudentComment').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <div class="w3-row" >
                                    <label class=" w3-quarter w3-theme-l1 w3-padding">Enter Comment</label>
                                    <textarea class="w3-input w3-twothird w3-margin-left gems_user_input w3-left-align" data-key="comment" type="textarea" maxLength="450" placeholder="Enter comment here..."  rows="5" autofocus></textarea>
                                </div>
                                <input class="gems_user_input" style="display:none;" data-key="student_id" value="${this.prompt_data["student_id"]}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Comment</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptDelStudentComment extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete Student Comment",
                    "prompt_message":" Delete this comment from the database?",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqDelStudentComment').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
         this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <input class="gems_user_input"  style="display:none" data-key="id" value="${this.prompt_data['id']}"></input>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
                    
    }
}
class GemsPromptAddStudent extends GemsPrompt 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Add a Student",
            "prompt_message": "This is where you add a new student to the GEMS database.  <br> In order to enroll the student in classes, or add test scores search for the student in the title bar above.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAddStudent').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
            "modal_default_date": new Date().toISOString().slice(0, 10)
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <label class="w3-left">IDOC Number</label>
                                <input class="w3-input gems_user_input" data-key="IDOC" type="input" maxLength="6" autocomplete="off" required=""></input>
                                <label class="w3-left">First Name</label>
                                <input class="w3-input gems_user_input" data-key="first_name" type="input" autocomplete="off" required=""></input>
                                <label class="w3-left">Last Name</label>
                                <input class="w3-input gems_user_input" data-key="last_name" type="input" autocomplete="off" required=""></input>
                                <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding" style="min-width:150px">Select an Institution</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="institution" style="width:150px;">
                                        ${this.prompt_data["institution"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select></div>
                                  <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding" style="min-width:150px" >Select a Housing Unit</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="housing_unit" style="width:150px;">
                                        ${this.prompt_data["housing_unit"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select></div>
                                <label class="w3-left">Date Entered</label>
                                <input class="w3-input gems_user_input " data-key="entry_date" type="date" pattern="([1-2])([\d])([\d])([\d])([-])([0-1])([\d])([-])([0-3])([\d])" title="Please enter a date in the format of yyyy-mm-dd" autocomplete="off" value="${this.modal_params['modal_default_date']}" required>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Student</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptEditStudent extends GemsPrompt 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Edit a Student",
            "prompt_message": "Here is where you can edit the information of a student.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqEditStudent').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"

        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <label class="w3-left">User IDOC Number</label>
                                <input class="w3-input gems_user_input" data-key="IDOC" type="input" maxLength="6" autocomplete="off" required value="${this.prompt_data['IDOC']}"></input>
                                <label class="w3-left">First Name</label>
                                <input class="w3-input gems_user_input" data-key="first_name" type="input" autocomplete="off" required value="${this.prompt_data['first_name']}"></input>
                                <label class="w3-left">Last Name</label>
                                <input class="w3-input gems_user_input" data-key="last_name" type="input" autocomplete="off" required value="${this.prompt_data['last_name']}"></input>
                                <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding" style="min-width:150px">Select an Institution</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="institution" style="width:150px;">
                                        <option><option>
                                        ${this.prompt_data["housing"]["institution"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select></div>
                                  <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding" style="min-width:150px" >Select a Housing Unit</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="housing_unit" style="width:150px;">
                                        <option><option>
                                        ${this.prompt_data["housing"]["housing_unit"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select></div>
                                <label class="w3-left">Entry Date</label>
                                <input class="w3-input gems_user_input " data-key="entry_date" type="date" pattern="([1-2])([\d])([\d])([\d])([-])([0-1])([\d])([-])([0-3])([\d])" title="Please enter a date in the format of yyyy-mm-dd" autocomplete="off" value="${this.prompt_data['entry_date']}" required=>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit Student</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>
                    `;
    }
}
class GemsPromptDelStudent extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete Student Entry",
                    "prompt_message":" Delete this student's entry from GEMS? <br> <b>Warning:<b> This action will delete all test history records and enrollment records associated with this student.",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqDelStudent').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class="w3-theme-l1 w3-margin-top w3-margin-bottom w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> 
                            Student: #${this.prompt_data["IDOC"]}  ${this.prompt_data["last_name"]}  ${this.prompt_data["first_name"]} 
                        </div>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
    }
}
class GemsPromptEnterStudentBarcodes extends GemsPrompt
{
     constructor() 
     {
        super();
        this.modal_params = {
            "prompt_header": "Print Student Barcodes",
            "prompt_message": 'Enter student IDOC in the input below and click "Add".  The result will be displayed in the preview below.  <br> Continue until you are finished then click "Print".',
            "prompt_id": "gems_prompt",
            "results_id": "gems_prompt_barcode_preview",
            "modal_on_submit": "gems_controller.requests.get('GemsReqEnterStudentBarcodes').finalizeRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"

        };
        this.html = `
                            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                                <div class="w3-modal-content w3-theme-l5 w3-card">
                                        <header class="w3-theme-d3 w3-content ">
                                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                        </header>
                                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" >
                                                ${this.modal_params["prompt_message"]} 
                                            </div>
                                            <div class="w3-row w3-margin-bottom">
                                                <input class="w3-twothird w3-input" id="gems_user_input" placeholder="Enter IDOC..." ></input>
                                                <button class="w3-button w3-theme-d3 w3-quarter" onclick="gems_controller.requests.get('GemsReqEnterStudentBarcodes').submitRequest();">Add Barcode</button>
                                            </div>
                                            <div class="w3-container w3-margin w3-margin-bottom"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Print Barcodes</button>
                                                  <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                                            </div>
                                            <div id=${this.modal_params["results_id"]} class="w3-row">
            
                                            </div>
                                        </div>
                                       
                                </div>
                            </div>
                                `;
        return this;
    }
}
class GemsPromptEditTimesheet extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_header":"Edit this Date",
                                "prompt_id":"gems_prompt",
                                "modal_on_submit": "gems_controller.requests.get('GemsReqUserTimesheetEditEntry').submitRequest()",
                                "modal_on_cancel":"document.getElementById('gems_prompt').remove();"
                            };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                        <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <div class="w3-theme-l1 w3-margin-top w3-padding w3-center" style="font-size: 16px;font-weight:bold;">Edit the following date in your timecard:  ${this.prompt_data["entryDate"]}</div>
                            <table class="w3-table-all w3-hoverable w3-margin-top w3-maargin-bottom">
                                <tr class="w3-theme-d1"><th>Time In AM</th><th>Time Out AM</th><th>Time In PM</th><th>Time Out PM</th></tr>
                                <td><input  class="w3-input gems_timesheet_time" data-key="timeInAM"  type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.prompt_data["timeInAM"]}"></td>
                                <td><input  class="w3-input gems_timesheet_time" data-key="timeOutAM" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.prompt_data["timeOutAM"]}"></td>
                                <td><input  class="w3-input gems_timesheet_time" data-key="timeInPM" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title=a"Please enter time in 24-hour time format(ie. 13:00)" value="${this.prompt_data["timeInPM"]}"></td>
                                <td><input  class="w3-input gems_timesheet_time" data-key="timeOutPM" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.prompt_data["timeOutPM"]}"></td>
                            </table>
                            <footer class='w3-container w3-center w3-margin'>
                                <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Update</button>
                                <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                            </footer>
                    </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptDelTimesheetEntry extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_header":"Delete this Date",
                                "prompt_id":"gems_prompt",
                                "modal_on_submit": "gems_controller.requests.get('GemsReqUserTimesheetDelEntry').submitRequest();",
                                "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                            };
        this.html = `
                <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card-4">
                <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                </header>
                <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <p>Delete the following date in your timecard:</p>
                        <div class="w3-theme-l1 w3-margin-top w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> ${this.prompt_data["entryDate"]}</div>
                       
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                </div>
                </div>
                </div>
                    `;
    }
}
class GemsPromptDisplayUserTimesheet extends GemsPrompt 
{
    constructor(prompt_data) 
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Select a Month",
            "prompt_message": "Please select a Month or range of Months to display. <br> By default the current month is selected.",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqDisplayUserTimesheet').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.setDefaultDates();

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin" >
                                    <label class="w3-third w3-theme-l1 w3-padding" style="min-width:150px">Select the beginning date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-left gems_user_input" data-key="date_from"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_from_default']}"></input>
                                    <label class="w3-third w3-theme-l1 w3-padding" style="min-width:150px">Select the end date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-left gems_user_input" data-key="date_to"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_to_default']}"></input>
                                    <input class="gems_user_input" style="display:none" data-key="user_id" value="${this.prompt_data['user_id']}"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Display Timesheet</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
    setDefaultDates()
    {
        //set date_from to the first day of current month
        let date_from = new Date();
        date_from.setDate(1);

        //set date_to to the last day of the same month
        let date_to = new Date();
        date_to.setMonth(date_from.getMonth() + 1);
        date_to.setDate(1);
        date_to.setDate(date_to.getDate() - 1);

        this.modal_params["date_from_default"] = date_from.toISOString().slice(0,10);
        this.modal_params["date_to_default"] = date_to.toISOString().slice(0,10);
    }
}
class GemsPromptUserChangePassword extends GemsPrompt 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Change My Password",
            "prompt_message": " Please type your new password, then confirm in the second input. ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqUserChangePassword').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                
                                <label class="w3-left">Type New Password</label>
                                <input class="w3-input gems_user_input" data-key = "password" type="password" autocomplete="off" required=""></input>
                                <label class="w3-left">Re-Type New Password</label>
                                <input class="w3-input gems_user_input" data-key="confirm" type="password" autocomplete="off" required=""></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Reset Pasword</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptUserChangeTheme extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_header":"Change My Theme",
                                "prompt_message":"Here is where you can select a new theme for GEMS.",
                                "prompt_id":"gems_prompt",
                                "modal_on_submit":"gems_controller.requests.get('GemsReqUserChangeTheme').submitRequest();",
                                "modal_on_cancel":"document.getElementById('gems_prompt').remove()",
                            };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="">${this.modal_params["prompt_message"]} </div>
                                <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding">Select a theme</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="theme" style="width:60%;" onchange="gemsUpdateThemePreview(this.selectedOptions[0].text)">
                                        ${this.prompt_data.map(row=>`<option value="${row["path"]}">${row["theme"]}</option>`).join(' ')}
                                    </select></div>
                                    <iframe src='GemsReqPreviewTheme/{"theme":"w3-theme-grey.css"}' width="85%" height="400px" id="gems_theme_preview"></iframe>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Change Theme</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptUserChangeAvatar extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_header":"Change My Avatar",
                                "prompt_message":'Here is where you can select a new avatar picture. <br> In order to add custom avatars please contact your administrator.',
                                "prompt_id":"gems_prompt",
                                "modal_on_submit":"gems_controller.requests.get('GemsReqUserChangeAvatar').submitRequest();",
                                "modal_on_cancel":"document.getElementById('gems_prompt').remove()",
                            };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style=" ">${this.modal_params["prompt_message"]} </div>
                                <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding">Select an avatar</label>
                                    <select class="w3-select w3-margin-bottom w3-margin-left gems_user_input" data-key="avatar" style="width:60%;" onchange="gemsUpdateAvatarPreview(this.selectedOptions[0].text)">>
                                        ${this.prompt_data.map(row=>`<option value="${row["path"]}">${row["avatar"]}</option>`)}
                                    </select>
                                    <div class="w3-row">
                                        <div class="w3-half">
                                        </div>
                                        <div class="w3-third">
                                            <img src="/static/gems/img/avatar/avatar1.png" id="gems_avatar_preview" height="150px" width="150px" style="border-radius:50%">
                                        </div>
                                    </div>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Change Picture</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptAdminAddUser extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_header":"Add New Database User",
                                "prompt_message":" This is where you add a new T.A. or Teacher to GEMS. They are now a GEMS user and are able to log on to GEMS. <br> In order to elevate their permission please ask a site administrator.",
                                "prompt_id":"gems_prompt",
                                "modal_on_submit":"gems_controller.requests.get('GemsReqAdminAddUser').submitRequest();",
                                "modal_on_cancel":"document.getElementById('gems_prompt').remove()",
                                "modal_default_date": new Date().toISOString().slice(0,10)
                            };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <label class="w3-left">User IDOC Number</label>
                                <input class="w3-input gems_add_user_input" data-key="username" type="input" maxLength="6" autocomplete="off" required=""></input>
                                <label class="w3-left">Password</label>
                                <input class="w3-input gems_add_user_input" data-key="password" type="password" autocomplete="off" required=""></input>
                                <label class="w3-left">First Name</label>
                                <input class="w3-input gems_add_user_input" data-key="first_name" type="input" autocomplete="off" required=""></input>
                                <label class="w3-left">Last Name</label>
                                <input class="w3-input gems_add_user_input" data-key="last_name" type="input" autocomplete="off" required=""></input>
                                <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding">Select a Job Title</label>
                                    <select class="w3-select w3-margin-left gems_add_user_input" data-key="jobTitle" style="width:150px;">
                                        ${this.prompt_data.map(row=>`<option>${row["jobTitle"]}</option>`)}
                                    </select></div>
                                <label class="w3-left">Date Hired</label>
                                <input class="w3-input gems_add_user_input " data-key="date_joined" type="date" pattern="([1-2])([\d])([\d])([\d])([-])([0-1])([\d])([-])([0-3])([\d])" title="Please enter a date in the format of yyyy-mm-dd" autocomplete="off" value="${this.modal_params['modal_default_date']}" required>
                                <label class="w3-left">Pay Rate</label>
                                <input class="w3-input gems_add_user_input" data-key="payRate" maxLength="4" value="0.00" autocomplete="off" pattern="[0-9][\.][0-9][0-9]" title="Please match the required format." required>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add User</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptAdminEditUser extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Edit Database User",
                    "prompt_message":" Here is where you edit a T.A. or Teacher who is currently in GEMS. <br> Note:  Please edit students and other school related information in the \"Manage a Student\" input on the title bar.",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit":"gems_controller.requests.get('GemsReqAdminEditUser').submitRequest();",
                    "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
                    
                };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <label class="w3-left">User IDOC Number</label>
                                <input class="w3-input gems_user_input" data-key="new_username" type="input" maxLength="6" autocomplete="off" required value="${this.prompt_data['username']}"></input>
                                <label class="w3-left">First Name</label>
                                <input class="w3-input gems_user_input" data-key="first_name" type="input" autocomplete="off" required value="${this.prompt_data['first_name']}"></input>
                                <label class="w3-left">Last Name</label>
                                <input class="w3-input gems_user_input" data-key="last_name" type="input" autocomplete="off" required value="${this.prompt_data['last_name']}"></input>
                                <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding">Select a Job Title</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="jobTitle" style="width:150px;" required value="${this.prompt_data['jobTitle']}">
                                        ${this.prompt_data['job_select'].map(row=>`<option>${row["jobTitle"]}</option>`)}
                                    </select></div>
                                <label class="w3-left">Date Hired</label>
                                <input class="w3-input gems_user_input " data-key="date_joined" type="date" pattern="([1-2])([\d])([\d])([\d])([-])([0-1])([\d])([-])([0-3])([\d])" title="Please enter a date in the format of yyyy-mm-dd" autocomplete="off" value="${this.prompt_data['date_joined']}" required=>
                                <label class="w3-left">Pay Rate</label>
                                <input class="w3-input gems_user_input" data-key="payRate" maxLength="4" autocomplete="off" pattern="[0-9][\.][0-9][0-9]?" title="Please match the required format." required value="${this.prompt_data['payRate']}">
                                <input class="w3-hide gems_user_input"  data-key="username" value="${this.prompt_data['username']}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit User</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>
                    `;
    }
}
class GemsPromptAdminDelUser extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete User Entry",
                    "prompt_message":" Delete this user's entry from GEMS? ",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqAdminDelUser').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class="w3-theme-l1 w3-margin-top w3-margin-bottom w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> 
                            User: #${this.prompt_data["username"]}  ${this.prompt_data["last_name"]}  ${this.prompt_data["first_name"]} a ${this.prompt_data["jobTitle"]}
                        </div>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
    }
}
class GemsPromptAdminResetPassword extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header":"Reset User's Password",
            "prompt_message":" Please type the new password for ",
            "prompt_id":"gems_prompt",
            "modal_on_submit":"gems_controller.requests.get('GemsReqAdminResetPassword').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} ${this.prompt_data['first_name']} ${this.prompt_data['last_name']} #${this.prompt_data['username']}
                                </div>
                                <label class="w3-left">Type New Password</label>
                                <input class="w3-input gems_user_input" data-key = "password" type="password" autocomplete="off" required=""></input>
                                <label class="w3-left">Re-Type New Password</label>
                                <input class="w3-input gems_user_input" data-key="confirm" type="password" autocomplete="off" required=""></input>
                                <input class="w3-input gems_user_input" data-key="username"  value="${this.prompt_data['username']}" style="display:none;"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Reset Pasword</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptAdminAddTest extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header":"Add a Test",
            "prompt_message":" Add a test to the database ",
            "prompt_id":"gems_prompt",
            "modal_on_submit":"gems_controller.requests.get('GemsReqAdminAddTest').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <label class="w3-left">Test Name</label>
                                <input class="w3-input gems_user_input" data-key="name" type="input"  autocomplete="off" required=""></input>
                                <label class="w3-left">Passing Score</label>
                                <input class="w3-input gems_user_input" data-key="passing_score" type="number"  autocomplete="off" value="0" required=""></input>
                                <label class="w3-left">Test is Active?</label>
                                <select class="w3-select gems_user_input" data-key="active">
                                    <option value="True" selected="">Yes</option>
                                    <option value="False">No</option>
                                </select>
                                <label class="w3-left">Certificate Available?</label>
                                <select class="w3-select gems_user_input" data-key="certificate">
                                    <option value="True">Yes</option>
                                    <option value="False" selected="">No</option>
                                </select>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Test</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptAdminEditTest extends GemsPrompt
{
        constructor(prompt_data)
        {
            super();
            this.prompt_data = prompt_data;
            this.modal_params = {
                "prompt_header":"Edit a Test",
                "prompt_message":"Edit a test in the database.",
                "prompt_id":"gems_prompt",
                "modal_on_submit":"gems_controller.requests.get('GemsReqAdminEditTest').submitRequest();",
                "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
            };
            this.html = `
                        <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                        <div class="w3-modal-content w3-theme-l5 w3-card">
                                <header class="w3-theme-d3 w3-content ">
                                    <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                </header>
                                <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                        ${this.modal_params["prompt_message"]} 
                                    </div>
                                    <label class="w3-left">Test Name</label>
                                    <input class="w3-input gems_user_input" data-key="name" type="input"  autocomplete="off" required="" value="${this.prompt_data["name"]}"></input>
                                    <label class="w3-left">Passing Score</label>
                                    <input class="w3-input gems_user_input" data-key="passing_score" type="number"  autocomplete="off" required="" value="${this.prompt_data["passing_score"]}"></input>
                                    <label class="w3-left">Test is Active?</label>
                                    <select id="gems_test_active" class="w3-select gems_user_input" data-key="active" value="${this.prompt_data["active"]}">
                                        <option value="True">Yes</option>
                                        <option value="False">No</option>
                                    </select>
                                    <label class="w3-left">Certificate Available?</label>
                                    <select id="gems_cert_avail" class="w3-select gems_user_input" data-key="certificate" value="${this.prompt_data["certificate"]}">
                                        <option value="True">Yes</option>
                                        <option value="False" >No</option>
                                    </select>
                                    <input class="gems_user_input" data-key="id" style="display:none" value="${this.prompt_data["id"]}"></input>
                                    <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                        <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit Test</button>
                                        <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                    </footer>
                                </div>
                        </div>
                        </div>
    
            `;
    }
}
class GemsPromptAdminDelTest extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete a Test",
                    "prompt_message":"Warning: Deleting this test will remove all associated test scores. ",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqAdminDelTest').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class="w3-theme-l1 w3-margin-top w3-margin-bottom w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> 
                            Delete the following test: ${this.prompt_data["name"]} 
                        </div>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
    }
}
class GemsPromptAddClassTimeslot extends GemsPrompt 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Add a Class Timeslot",
            "prompt_message": "Here you can assign an existing class to a timeslot. ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAddClassTimeslot').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <div class="w3-content w3-margin" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available class.</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="id" style="width:60%;">
                                        ${this.prompt_data.map(row=>`<option value=${row["id"]}>${row["name"]}</option>`)}
                                    </select>
                                </div>
                                <div class="w3-content w3-margin w3-margin-bottom" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Enter an hour</label>
                                    <input  class="w3-input w3-margin-left gems_user_input" data-key="hour" type="time" style="width:60%;display:inline;" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" >
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Timeslot</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptEditClassTimeslot extends GemsPrompt
{
     constructor(prompt_data) 
     {
         super();
         this.prompt_data = prompt_data;
         this.modal_params = {
             "prompt_header": "Edit a Class Timeslot",
             "prompt_message": "Here you can change the timeslot of an existing class.",
             "prompt_id": "gems_prompt",
             "modal_on_submit": "gems_controller.requests.get('GemsReqEditClassTimeslot').submitRequest();",
             "modal_on_cancel": "document.getElementById('gems_prompt').remove()"
         };
         this.html = `
                        <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                        <div class="w3-modal-content w3-theme-l5 w3-card">
                                <header class="w3-theme-d3 w3-content ">
                                    <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                </header>
                                <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <div class="w3-content w3-margin" style="">
                                    <p>Change the timeslot for:  ${this.prompt_data["subject"]}, ${this.prompt_data["classroom"]}</p>
                                </div>
                                <div class="w3-content w3-margin w3-margin-bottom" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Enter an hour</label>
                                    <input  class="w3-input w3-margin-left gems_user_input" data-key="hour" type="time" style="width:60%;display:inline;" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" ></input>
                                    <input class=" gems_user_input" data-key="id" style="display:none" value="${this.prompt_data["id"]}"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit Class Timeslot</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                                </div>
                        </div>
                        </div>
    
            `;
    }
}
class GemsPromptDelClassTimeslot extends GemsPrompt 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Edit a Class Timeslot",
            "prompt_message": "Here you can change the timeslot of an existing class.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqDelClassTimeslot').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                        <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                        <div class="w3-modal-content w3-theme-l5 w3-card">
                                <header class="w3-theme-d3 w3-content ">
                                    <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                </header>
                                <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <div class="w3-content w3-margin" style="">
                                    <p>Delete the timeslot for:  ${this.prompt_data["subject"]}, ${this.prompt_data["classroom"]} at ${this.prompt_data["hour"]}</p>
                                </div>
                                <input class=" gems_user_input" data-key="id" style="display:none" value="${this.prompt_data["id"]}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Delete Class Timeslot</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                                </div>
                        </div>
                        </div>
    
            `;
    }
}
class GemsPromptAdminAddClass extends GemsPrompt 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Add a Class Timeslot",
            "prompt_message": "Here you can assign an existing class to a timeslot. ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAdminAddClass').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <div class="w3-content w3-margin" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available subject.</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="subject" style="width:60%;">
                                        ${this.prompt_data["subjects"].map(row=>`<option value=${row["id"]}>${row["subject"]}</option>`)}
                                    </select>
                                </div>
                                 <div class="w3-content w3-margin" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available teacher.</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="teacher" style="width:60%;">
                                        ${this.prompt_data["teachers"].map(row=>`<option value=${row["id"]}>${row["teacher"]}</option>`)}
                                    </select>
                                </div>
                                 <div class="w3-content w3-margin" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available class.</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="classroom" style="width:60%;">
                                        ${this.prompt_data["classrooms"].map(row=>`<option value=${row["id"]}>${row["classroom"]}</option>`)}
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Class</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptAdminEditClass extends GemsPrompt
{
    constructor(prompt_data)
    {
            super();
            this.prompt_data = prompt_data;
            this.modal_params = {
                "prompt_header":"Edit a Class",
                "prompt_message":"Edit a class entry in the database.",
                "prompt_id":"gems_prompt",
                "modal_on_submit":"gems_controller.requests.get('GemsReqAdminEditClass').submitRequest();",
                "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
            };
            this.html = `
                        <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                        <div class="w3-modal-content w3-theme-l5 w3-card">
                                <header class="w3-theme-d3 w3-content ">
                                    <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                </header>
                                <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                        ${this.modal_params["prompt_message"]} 
                                    </div>
                                    <div class="w3-content w3-margin" style="">
                                        <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available subject.</label>
                                        <select class="w3-select w3-margin-left gems_user_input" data-key="subject" style="width:60%;">
                                            ${this.prompt_data["select_boxes"]["subjects"].map(row=>`<option value=${row["id"]}>${row["subject"]}</option>`).join('')}
                                        </select>
                                        </div>
                                        <div class="w3-content w3-margin" style="">
                                            <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available teacher.</label>
                                            <select class="w3-select w3-margin-left gems_user_input" data-key="teacher" style="width:60%;">
                                                ${this.prompt_data["select_boxes"]["teachers"].map(row=>`<option value=${row["id"]}>${row["teacher"]}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="w3-content w3-margin" style="">
                                        <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available class.</label>
                                        <select class="w3-select w3-margin-left gems_user_input" data-key="classroom" style="width:60%;">
                                            ${this.prompt_data["select_boxes"]["classrooms"].map(row=>`<option value=${row["id"]}>${row["classroom"]}</option>`).join('')}
                                        </select>
                                        <input class="w3-input gems_user_input" style="display:none" data-key="id" value="${this.prompt_data["id"]}"></input>
                                    </div>
                                    <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                        <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit Class</button>
                                        <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                    </footer>
                                </div>
                        </div>
                        </div>
    
            `;
    }
}
class GemsPromptAdminDelClass extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete a Class",
                    "prompt_message":"Warning: Deleting this class will remove all associated enrollment records for students enrolled in that class. ",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqAdminDelClass').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class="w3-theme-l1 w3-margin-top w3-margin-bottom w3-padding w3-center" style="font-size: 16px;"> 
                            Delete the following test: ${this.prompt_data["subject"]} with ${this.prompt_data["teacher"]} in room ${this.prompt_data["classroom"]}?
                        </div>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
    }
}
class GemsPromptAdminAddSubject extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header": "Add Subject",
            "prompt_message": "Add a subject which may be used to compose classes.  In GEMS a class is composed of a subject, a teacher, and a classroom.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAdminAddSubject').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <div class="w3-row" >
                                    <label class=" w3-quarter w3-theme-l1 w3-padding">Enter Subject</label>
                                    <input class="w3-input w3-twothird w3-margin-left gems_user_input w3-left-align" data-key="subject" placeholder="Enter subject here..." autofocus></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Subject</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptAdminDelSubject extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header": "Delete Subject",
            "prompt_message": "Delete a subject from the database.<br>  Deleting a subject will delete all classes, class timeslots, or enrollment records associated with that subject.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAdminDelSubject').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Delete Subject</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptWebAttendance extends GemsPrompt 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Select a Class",
            "prompt_message": "Please select a class that you will be taking attendance for.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqWebAttendance').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding" style="min-width:150px">Select an Classroom</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="classroom" style="width:60%">
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select></div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Display Attendance</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptManualAttendance extends GemsPrompt
{
    constructor(prompt_data) 
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Manual Attendance",
            "prompt_message": "Manually add an attendance record for an enrolled student. ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqManualAttendance').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <div class="w3-content w3-margin">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Student IDOC</label>
                                    <input class="w3-input w3-margin-left gems_user_input" data-key="IDOC" style="width:60%;display:inline;" required></input>
                                </div>
                                <div class="w3-content w3-margin" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available class.</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="class" style="width:60%;">
                                        ${this.prompt_data["class"].map(row=>`<option value=${row["id"]}>${row["name"]}</option>`)}
                                    </select>
                                </div>
                                <div class="w3-content w3-margin">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Enter the scheduled hour</label>
                                    <input class="w3-input w3-margin-left gems_user_input" data-key="hour" type="time" style="width:60%;display:inline;" required></input>
                                </div>
                                 <div class="w3-content w3-margin" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available day.</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="day" style="width:60%;">
                                        ${this.prompt_data["day"].map(row=>`<option value=${row["id"]}>${row["name"]}</option>`)}
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Submit</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptDisplayDailyAttendance extends GemsPrompt
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Display Daily Attendance",
            "prompt_message": "Please select the class, hour, and date for which you would like to display attendance.",
            "prompt_id": "gems_prompt",
            "default_date": new Date().toISOString().slice(0,10),
            "modal_on_submit": "gems_controller.requests.get('GemsReqDisplayDailyAttendance').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <div class="w3-content w3-margin" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select an available class.</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="class" style="width:60%;">
                                        ${this.prompt_data["class"].map(row=>`<option value=${row["id"]}>${row["name"]}</option>`)}
                                    </select>
                                </div>
                                <div class="w3-content w3-margin">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Enter the scheduled hour</label>
                                    <input class="w3-input w3-margin-left gems_user_input" data-key="hour" type="time" style="width:60%;display:inline;" required></input>
                                </div>
                                 <div class="w3-content w3-margin" style="">
                                    <label class="w3-left w3-theme-l1 w3-padding" style="width:30%">Select a date.</label>
                                    <input  class="w3-input w3-margin-left gems_user_input" data-key="scan_date"  type="date"  style="width:60%;display:inline" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['default_date']}"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Display Attendance</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptDisplayIndividualAttendance extends GemsPrompt
{
     constructor() {
        super();
        this.modal_params = {
            "prompt_header": "Display Student Attendance",
            "prompt_message": "Please enter an IDOC and select a range of dates. <br> By default the current month is selected.",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqDisplayIndividualAttendance').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.setDefaultDates();

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin " >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" style="min-width:150px" >Enter an IDOC number.</label>
                                    <input class="w3-third w3-input w3-margin-left w3-margin-bottom gems_user_input" data-key="IDOC" style="width:60%"></input>
                                    <label class="w3-third w3-theme-l1 w3-margin-bottom w3-padding" style="min-width:150px">Select the beginning date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-left w3-margin-bottom gems_user_input" data-key="date_from"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_from_default']}"></input>
                                    <label class="w3-third w3-theme-l1 w3-margin-bottom w3-padding" style="min-width:150px">Select the end date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-left gems_user_input" data-key="date_to"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_to_default']}"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Display Attendance</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
    setDefaultDates()
    {
        //set date_from to the first day of current month
        let date_from = new Date();
        date_from.setDate(1);

        //set date_to to the last day of the same month
        let date_to = new Date();
        date_to.setMonth(date_from.getMonth() + 1);
        date_to.setDate(1);
        date_to.setDate(date_to.getDate() - 1);

        this.modal_params["date_from_default"] = date_from.toISOString().slice(0,10);
        this.modal_params["date_to_default"] = date_to.toISOString().slice(0,10);
    }
}
class GemsPromptGenerateCalloutCSV extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Generate Attendance CSV",
            "prompt_message": "Please select a class and day for the report.",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateCalloutCSV').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin " >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select an available class</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="classroom" style="width:60%">
                                        ${this.prompt_data["classroom"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select a day.</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="day" style="width:60%">
                                        ${this.prompt_data["day"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptGenerateClassRoster extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Generate Class Roster",
            "prompt_message": "Please select a class for the report.  If you would like the report to be saved to CSV check the box below. <br> Otherwise it will be displayed in the browser.",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateClassRoster').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin " >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select an available classroom</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="classroom" style="width:60%">
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select a sort order.</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="sort_order" style="width:60%">
                                        <option value="IDOC">IDOC</option>
                                        <option value="last_name">Last Name</option>
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding " style="margin-right:50px">Export to CSV?</label>
                                    <div class="w3-third gems-checkbox-container">
                                        <i class="w3-hover-opacity  w3-left gems-checkbox-off fa fa-circle gems_user_input_check" data-status="0" style="font-size:18px;" data-key="csv" onclick="gemsToggleCheckbox(this)"></i>
                                    </div>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptGenerateEnrolledStudents extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Generate Enrolled Students List",
            "prompt_message": "Please select a classroom for the report. This report will display a list of students enrolled in a classroom without scheduling information.",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateEnrolledStudents').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin " >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select an available class</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="classroom" style="width:60%">
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select a sort order.</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="sort_order" style="width:60%">
                                        <option value="IDOC">IDOC</option>
                                        <option value="last_name">Last Name</option>
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptGenerateDailyAttendance extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Generate Daily Attendance",
            "prompt_message": "Please select a class for the report. This report will display the students who scanned in for the selected class, date, and hour.",
            "prompt_id": "gems_prompt",
            "default_date": new Date().toISOString().slice(0,10),
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateDailyAttendance').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin " >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" >Select an available class</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="classroom" style="width:60%">
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom"> Enter a date</label>
                                    <input  class="w3-input w3-twothird w3-margin-left  w3-margin-bottom  gems_user_input" data-key="scan_date"  type="date"  pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['default_date']}" style="width:60%"></input>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom">Enter an hour</label>
                                    <input class="w3-input w3-twothird w3-margin-left  w3-margin-bottom  gems_user_input" data-key="hour" type="time" style="width:60%"></input>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" >Select a sort order.</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="sort_order" style="width:60%">
                                        <option value="IDOC">IDOC</option>
                                        <option value="last_name">Last Name</option>
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptGenerateContactHours extends GemsPrompt 
{
    constructor(prompt_data) 
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Generate Contact Hours ",
            "prompt_message": "Please select a classroom, range of dates, and any number of hours for the contact hour report.<br> If your want multiple hours simply select any number from the select option menu (holding 'shift' or 'ctrl')<br> and submit the request.",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateContactHours').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.setDefaultDates();

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin" >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" >Select an available classroom</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="classroom" style="width:60%">
                                        <option value="%">All Classrooms</option>
                                        ${this.prompt_data["classroom"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" style="min-width:150px">Select the beginning date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-bottom w3-margin-left gems_user_input" data-key="date_from"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_from_default']}"></input>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" style="min-width:150px">Select the end date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-bottom w3-margin-left gems_user_input" data-key="date_to"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_to_default']}"></input>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" >Select available Hour(s)</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_select_multiple" data-key="hour" multiple style="width:60%">
                                        ${this.prompt_data["hour"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" >Select a sort order.</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="sort_order" style="width:60%">
                                        <option value="IDOC">IDOC</option>
                                        <option value="last_name">Last Name</option>
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
    setDefaultDates()
    {
        //set date_from to the first day of current month
        let date_from = new Date();
        date_from.setDate(1);

        //set date_to to the last day of the same month
        let date_to = new Date();
        date_to.setMonth(date_from.getMonth() + 1);
        date_to.setDate(1);
        date_to.setDate(date_to.getDate() - 1);

        this.modal_params["date_from_default"] = date_from.toISOString().slice(0,10);
        this.modal_params["date_to_default"] = date_to.toISOString().slice(0,10);
    }
}
class GemsPromptGenerateAttendanceScan extends GemsPrompt {
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Contact Hours ",
            "prompt_message": "Please select a classroom, and a range of dates. <br> This report will provide a list of names of the students who did not scan in that range.<br> In order to select only one day simply provide the desired day as the 'beginning date' and the next day as 'end date'.",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default": "",
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateAttendanceScan').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.setDefaultDates();

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <div class="w3-row w3-margin" >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" >Select an available Classroom</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="classroom" style="width:60%">
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" style="min-width:150px">Select the beginning date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-bottom w3-margin-left gems_user_input" data-key="date_from"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_from_default']}"></input>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" style="min-width:150px">Select the end date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-bottom w3-margin-left gems_user_input" data-key="date_to"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_to_default']}"></input>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" >Select a sort order.</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="sort_order" style="width:60%">
                                        <option value="IDOC">IDOC</option>
                                        <option value="last_name">Last Name</option>
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
    setDefaultDates() {
        //set date_from to the first day of current month
        let date_from = new Date();
        date_from.setDate(1);

        //set date_to to the last day of the same month
        let date_to = new Date();
        date_to.setMonth(date_from.getMonth() + 1);
        date_to.setDate(1);
        date_to.setDate(date_to.getDate() - 1);

        this.modal_params["date_from_default"] = date_from.toISOString().slice(0, 10);
        this.modal_params["date_to_default"] = date_to.toISOString().slice(0, 10);
    }
}
class GemsPromptGenerateDetails extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data[0];
        this.modal_params = {
            "prompt_header": "Details",
            "prompt_message": "",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <table class="w3-table-all">
                                    <tr class="w3-theme-d3">
                                        ${Object.keys(this.prompt_data).map(header=>`<th>${header}</th>`).join('')}
                                    </tr>
                                    <tr>   
                                        ${Object.keys(this.prompt_data).map(col_data=>`<td>${this.prompt_data[col_data]}</td>`).join('')}
                                    </tr>
                                </table>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Close Details</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptGenerateHistory extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "History",
            "prompt_message": "Viewing checkout history for: ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]} </h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} ${this.prompt_data["asset"]}</div>
                                <table class="w3-table-all">
                                    <tr class="w3-theme-d3">
                                        ${Object.keys(this.prompt_data["records"][0]).map(header=>`<th>${header}</th>`).join('')}
                                    </tr>
                                    <tr>   
                                        ${this.prompt_data["records"].map(row=>`<tr>${Object.keys(row).map(entry=>`<td>${row[entry]}</td>`).join('')}</tr>`).join('')}
                                    </tr>
                                </table>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Close Details</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptGenerateAssetsOut extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Generate Educational Assets Report",
            "prompt_message": "Please select a classroom for the report",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateAssetsOut').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin " >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select a Classroom</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="classroom" style="width:60%">
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select a Category</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="category" style="width:60%">
                                        <option value="All">All Assets</option>
                                        <option value="Book">Books</option>
                                        <option value="Item">Items</option>
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptGenerateAssetsIn extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Generate Educational Assets Report",
            "prompt_message": "Please select a classroom for the report",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateAssetsIn').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin " >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select a Classroom</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="classroom" style="width:60%">
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select a Category</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="category" style="width:60%">
                                        <option value="All">All Assets</option>
                                        <option value="Book">Books</option>
                                        <option value="Item">Items</option>
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptGenerateClassroomInventory extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Generate Educational Classroom Inventory Report",
            "prompt_message": "Please select a classroom for the report",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateClassroomInventory').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin " >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select a Classroom</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="classroom" style="width:60%">
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`)}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottome" style="min-width:150px">Select a Category</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="category" style="width:60%">
                                        <option value="All">All Assets</option>
                                        <option value="Book">Books</option>
                                        <option value="Item">Items</option>
                                    </select>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptGenerateTestHistory extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Contact Hours ",
            "prompt_message": "Please select a test and a range of dates for the report.",
            "prompt_id": "gems_prompt",
            "date_from_default": "",
            "date_to_default":"",
            "modal_on_submit": "gems_controller.requests.get('GemsReqGenerateTestHistory').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.setDefaultDates();

        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>

                                <div class="w3-row w3-margin" >
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" >Select a test</label>
                                    <select class="w3-third w3-select w3-margin-left w3-margin-bottom gems_user_input" data-key="test" style="width:60%">
                                        ${this.prompt_data["test"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" style="min-width:150px">Select the beginning date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-bottom w3-margin-left gems_user_input" data-key="date_from"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_from_default']}"></input>
                                    <label class="w3-third w3-theme-l1 w3-padding w3-margin-bottom" style="min-width:150px">Select the end date.</label>
                                    <input  class="w3-input w3-twothird w3-margin-bottom w3-margin-left gems_user_input" data-key="date_to"  type="date"  style="width:60%" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format." value="${this.modal_params['date_to_default']}"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Generate Report</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
    setDefaultDates()
    {
        //set date_from to the first day of current month
        let date_from = new Date();
        date_from.setDate(1);

        //set date_to to the last day of the same month
        let date_to = new Date();
        date_to.setMonth(date_from.getMonth() + 1);
        date_to.setDate(1);
        date_to.setDate(date_to.getDate() - 1);

        this.modal_params["date_from_default"] = date_from.toISOString().slice(0,10);
        this.modal_params["date_to_default"] = date_to.toISOString().slice(0,10);
    }
}
class GemsPromptEditBook extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Edit Educational Asset",
            "prompt_message": "",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqEditEducationalAsset').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]} </h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-row">
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Title</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="name" value="${this.prompt_data["record"]["name"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Author</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="author" value="${this.prompt_data["record"]["author"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Publisher</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="publisher" value="${this.prompt_data["record"]["publisher"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">ISBN</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="isbn" value="${this.prompt_data["record"]["isbn"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Permit Checkout</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_permit_checkout_select" data-key="permit_checkout">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Checkout Duration</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="checkout_duration" type="number" value="${this.prompt_data["record"]["checkout_duration"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Classroom</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_classroom_select" data-key="classroom">
                                        ${this.prompt_data["classroom_select"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Notes</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="notes" value="${this.prompt_data["record"]["notes"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Description</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="description" value="${this.prompt_data["record"]["description"]}"></input>
                                    <input class="gems_user_input" data-key="id"  style="display:none" value="${this.prompt_data['record']['id']}"></input>
                                    <input class="gems_user_input" data-key="asset_category"  style="display:none" value="Book"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Submit</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
    display()
    {   
        //override the display method to populate the select box with the correct result
        document.getElementById("gems_main_div").insertAdjacentHTML("afterbegin",this.html);

        let checkout_select = document.getElementById("gems_permit_checkout_select");
        let classroom_select = document.getElementById("gems_classroom_select");
        
        this.prompt_data["record"]["permit_checkout"] == true ? checkout_select.value = 1 : checkout_select.value = 0;
        classroom_select.value = this.prompt_data["record"]["classroom"];
    }
}
class GemsPromptEditItem extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Edit Educational Asset",
            "prompt_message": "",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqEditEducationalAsset').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]} </h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-row">
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Item Name</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="name" value="${this.prompt_data["record"]["name"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Manufacturer</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="manufacturer" value="${this.prompt_data["record"]["manufacturer"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Model Number</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="model_number" value="${this.prompt_data["record"]["model_number"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Serial Number</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="serial_number" value="${this.prompt_data["record"]["serial_number"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Category</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_item_category_select" data-key="category">
                                        ${this.prompt_data["item_category_select"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Permit Checkout</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_permit_checkout_select" data-key="permit_checkout">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Checkout Duration</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="checkout_duration" type="number" value="${this.prompt_data["record"]["checkout_duration"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Classroom</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_classroom_select" data-key="classroom">
                                        ${this.prompt_data["classroom_select"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Notes</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="notes" value="${this.prompt_data["record"]["notes"]}"></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Description</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="description" value="${this.prompt_data["record"]["description"]}"></input>
                                    <input class="gems_user_input" data-key="id"  style="display:none" value="${this.prompt_data['record']['id']}"></input>
                                    <input class="gems_user_input" data-key="asset_category"  style="display:none" value="Item"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Submit</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
    display()
    {   
        //override the display method to populate the select box with the correct result
        document.getElementById("gems_main_div").insertAdjacentHTML("afterbegin",this.html);

        let checkout_select = document.getElementById("gems_permit_checkout_select");
        let classroom_select = document.getElementById("gems_classroom_select");
        let item_category_select = document.getElementById("gems_item_category_select");
        
        this.prompt_data["record"]["permit_checkout"] == true ? checkout_select.value = 1 : checkout_select.value = 0;
        classroom_select.value = this.prompt_data["record"]["classroom"];
        item_category_select.value = this.prompt_data["record"]["category"];
    }
}
class GemsPromptDeleteEducationalAsset extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Delete Educational Asset",
            "prompt_message": "Warning: This transaction can not be reversed, and will delete all associated checkout records.<br>  Delete: ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqDeleteEducationalAsset').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]} </h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} Barcode: ${this.prompt_data["barcode"]}</div>
                                <input class="gems_user_input" data-key="id"  style="display:none" value="${this.prompt_data['id']}"></input>
                                <input class="gems_user_input" data-key="category"  style="display:none" value="${this.prompt_data['category']}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Delete</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptCheckinEducationalAsset extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Check-In an Educational Asset",
            "prompt_message": "Check-In the following asset: ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqCheckinEducationalAsset').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} Barcode: ${this.prompt_data["barcode"]}</div>

                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Check-In</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptCheckoutEducationalAsset extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Checkout Educational Asset",
            "prompt_message": "",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqCheckoutEducationalAsset').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]} </h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-row">
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Barcode</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="barcode" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Asset Category</label>
                                    <select class="w3-twothird w3-input gems_user_input" data-key="category">
                                        <option value="Book">Book</option>
                                        <option value="Item">Item</option>
                                    </select>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="student_id" value="${this.prompt_data["student_id"]}" style="display:none"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Check-Out</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptRenewEducationalAsset extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Renew an Educational Asset",
            "prompt_message": "Renew the following asset: ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqRenewEducationalAsset').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} ${this.prompt_data["name"]} Barcode: ${this.prompt_data["barcode"]}</div>

                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Renew</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptAddBook extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Add Educational Asset",
            "prompt_message": "Please fill all categories.  A barcode will be assigned automatically.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAddEducationalAsset').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]} </h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]}</div>
                                <div class="w3-row">
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Title</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="name" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Author</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="author" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Publisher</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="publisher" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">ISBN</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="isbn" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Permit Checkout</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_permit_checkout_select" data-key="permit_checkout">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Checkout Duration</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="checkout_duration" type="number" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Classroom</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_classroom_select" data-key="classroom">
                                        ${this.prompt_data["classroom_select"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Notes</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="notes" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Description</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="description" value=""></input>
                                    <input class="gems_user_input" data-key="asset_category"  style="display:none" value="Book"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Submit</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptAddItem extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Add Educational Asset",
            "prompt_message": "Please fill all categories.  A barcode will be assigned automatically.",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAddEducationalAsset').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]} </h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]}</div>
                                <div class="w3-row">
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Item Name</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="name" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Manufacturer</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="manufacturer" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Model Number</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="model_number" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Serial Number</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="serial_number" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Category</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_item_category_select" data-key="category">
                                        ${this.prompt_data["item_category_select"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Permit Checkout</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_permit_checkout_select" data-key="permit_checkout">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Checkout Duration</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="checkout_duration" type="number" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Classroom</label>
                                    <select class="w3-twothird w3-input gems_user_input" id="gems_classroom_select" data-key="classroom">
                                        ${this.prompt_data["classroom_select"].map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Notes</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="notes" value=""></input>
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Description</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="description" value=""></input>
                                    <input class="gems_user_input" data-key="asset_category"  style="display:none" value="Item"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Submit</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptCopyEducationalAsset extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Copy Educational Asset",
            "prompt_message": "This will add a new item with the properties of the existing item.<br> The item will be added with a barcode of it's own which will be displayed following the submission of the request.<br>  Copy the following record: ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqCopyEducationalAsset').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]} </h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} ${this.prompt_data["barcode"]} ${this.prompt_data["name"]}</div>
                                <input class="gems_user_input" data-key="id"  style="display:none" value="${this.prompt_data['id']}"></input>
                                <input class="gems_user_input" data-key="category"  style="display:none" value="${this.prompt_data['category']}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Copy</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptQuickCheckin extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header": "Check-in an Educational Asset",
            "prompt_message": "",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqQuickCheckin').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()",
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]} </h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            
                                <div class="w3-row w3-margin-top">
                                    <label class="w3-quarter w3-margin-right w3-theme-l1 w3-padding">Barcode</label>
                                    <input class="w3-twothird w3-input gems_user_input" data-key="barcode" value=""></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Check-In</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptEnterAssetBarcodes extends GemsPrompt
{
     constructor() 
     {
        super();
        this.modal_params = {
            "prompt_header": "Print Educational Asset Barcodes",
            "prompt_message": 'Enter the barcode, or range of barcodes, in the input(s) below and click "Add". <br> The result will be displayed in the preview below.   Continue until you are finished then click "Print".',
            "prompt_id": "gems_prompt",
            "results_id": "gems_prompt_barcode_preview",
            "modal_on_submit": "gems_controller.requests.get('GemsReqEnterAssetBarcodes').finalizeRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove()"

        };
        this.html = `
                            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                                <div class="w3-modal-content w3-theme-l5 w3-card">
                                        <header class="w3-theme-d3 w3-content ">
                                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                        </header>
                                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" >
                                                ${this.modal_params["prompt_message"]} 
                                            </div>
                                            <div class="w3-row w3-margin-bottom">
                                                <input class="w3-quarter w3-input w3-margin-right" id="gems_start_range" style="width:32%" type="number" placeholder="Start barcode..."></input>
                                                <input class="w3-quarter w3-input w3-margin-right" id="gems_end_range" style="width:31%" type="number" placeholder="Ending barcode..."></input>
                                                <button class="w3-button w3-theme-d3 w3-quarter w3-margin-bottom" onclick="gems_controller.requests.get('GemsReqEnterAssetBarcodes').submitRequest({'length':'range'});">Add Range</button>
                                                <hr>
                                                <input class="w3-twothird w3-input" id="gems_user_input" placeholder="Enter a barcode..." ></input>
                                                <button class="w3-button w3-theme-d3 w3-quarter" onclick="gems_controller.requests.get('GemsReqEnterAssetBarcodes').submitRequest({'length':'single'});">Add Barcode</button>
                                            </div>
                                            <div class="w3-container w3-margin w3-margin-bottom"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Print Barcodes</button>
                                                  <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                                            </div>
                                            <div id=${this.modal_params["results_id"]} class="w3-row">
            
                                            </div>
                                        </div>
                                       
                                </div>
                            </div>
                                `;
        return this;
    }
}
