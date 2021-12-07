/*
    *gems_report_view.js
      
  
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

class GemsReport
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
        document.getElementById("gems_report").firstChild.remove();
   }
}
class GemsReportUserSearch extends GemsReport
{
    constructor()
    {
        super();
        //extend me
    }
    display()
    {
        //overrides the display method in GemsReport to target the div for search results.
        document.getElementById("gems_prompt_search_results").insertAdjacentHTML("afterbegin",this.html);
    }
}
class GemsReportEditUserSearch extends GemsReportUserSearch
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"Please click on  the user you would like to edit.",
                                "modal_on_submit":"gems_controller.initGemsRequest(GemsReqAdminEditUser,event)"
                            };
        this.html = ` 
                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="">
                        ${this.modal_params["prompt_message"]} 
                    </div>
                    <table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                        <tr class="w3-theme-d1">
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                            <th>First Name</th><th>Job Title</th><th>Date Hired</th>
                        </tr>
                        ${this.prompt_data.map(row => `<tr class="gems_result_row"  onclick="${this.modal_params['modal_on_submit']}" >
                        <td data-key="username">${row['username']}</td><td data-key="last_name">${row['last_name']}</td><td data-key="first_name">${row['first_name']}</td>
                        <td data-key="jobTitle">${row['jobTitle']}</td><td data-key="date_joined">${row['date_joined']}</td><td data-key="payRate" style="display:none;">${row['payRate']}</td></tr>`).join('')}
                    </table>
                    `;
    }
}
class GemsReportDelUserSearch extends GemsReportUserSearch 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_message": "Please click on  the user whose security group you would like to modify",
            "modal_on_submit": "gems_controller.initGemsRequest(GemsReqAdminDelUser,event)"
        };
        this.html = ` 
                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="">
                        ${this.modal_params["prompt_message"]} 
                    </div>
                    <table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                        <tr class="w3-theme-d1">
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                            <th>First Name</th><th>Job Title</th><th>Date Hired</th>
                            </tr>
                            ${this.prompt_data.map(row => `<tr class="gems_result_row"  onclick="${this.modal_params['modal_on_submit']}"><td data-key="username">${row['username']}</td><td data-key="last_name">${row['last_name']}</td>
                            <td data-key="first_name">${row['first_name']}</td><td data-key="jobTitle">${row['jobTitle']}</td><td data-key="date_joined">${row['date_joined']}</td></tr>`).join('')}
                    </table>
                    `;
    }
}
class GemsReportResetPasswordSearch extends GemsReportUserSearch
{   
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"Please click on  the user whose password you would like to reset.",
                                "modal_on_submit":"gems_controller.initGemsRequest(GemsReqAdminResetPassword,event)"
                            };
        this.html = ` 
                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="">
                        ${this.modal_params["prompt_message"]} 
                    </div>
                    <table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                         <tr class = "w3-theme-d1">
                         <th onclick = "w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')"> IDOC </th> 
                         <th onclick = "w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')"> Last Name </th> 
                         <th> First Name </th><th>Job Title</th><th>Date Hired</th></tr>
                         ${this.prompt_data.map(row => `<tr class="gems_result_row"  onclick="${this.modal_params['modal_on_submit']}"><td data-key="username">${row['username']}</td><td data-key="last_name">${row['last_name']}</td>
                            <td data-key="first_name">${row['first_name']}</td><td data-key="jobTitle">${row['jobTitle']}</td><td data-key="date_joined">${row['date_joined']}</td></tr>`).join('')
                     } 
                    </table>
                    `;
    }
}
class GemsReportEditStudentSearch extends GemsReportUserSearch
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"Please click on  the student you would like to edit.",
                                "modal_on_submit":"gems_controller.initGemsRequest(GemsReqEditStudent,event)"
                            };
        this.html = ` 
                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding">
                        ${this.modal_params["prompt_message"]} 
                    </div>
                    <table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                        <tr class="w3-theme-d1">
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                            <th>First Name</th><th>Institution</th><th>Housing Unit</th><th>Entry Date</th>
                        </tr>
                        ${this.prompt_data.map(row => `<tr class="gems_result_row"  onclick="${this.modal_params['modal_on_submit']}" >
                        <td data-key="IDOC">${row['IDOC']}</td><td data-key="last_name">${row['last_name']}</td><td data-key="first_name">${row['first_name']}</td>
                        <td data-key="institution">${row['institution']}</td><td data-key="housing_unit">${row['housing_unit']}</td>
                        <td data-key="entry_date">${row['entry_date']}</td></tr>`).join('')}
                    </table>
                    `;
    }
}
class GemsReportDelStudentSearch extends GemsReportUserSearch
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"Please click on  the student you would like to delete from GEMS.",
                                "modal_on_submit":"gems_controller.initGemsRequest(GemsReqDelStudent,event)"
                            };
        this.html = ` 
                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding">
                        ${this.modal_params["prompt_message"]} 
                    </div>
                    <table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                        <tr class="w3-theme-d1">
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                            <th>First Name</th><th>Institution</th><th>Housing Unit</th><th>Entry Date</th>
                        </tr>
                        ${this.prompt_data.map(row => `<tr class="gems_result_row"  onclick="${this.modal_params['modal_on_submit']}" >
                        <td data-key="IDOC">${row['IDOC']}</td><td data-key="last_name">${row['last_name']}</td><td data-key="first_name">${row['first_name']}</td>
                        <td data-key="institution">${row['institution']}</td><td data-key="housing_unit">${row['housing_unit']}</td>
                        <td data-key="entry_date">${row['entry_date']}</td></tr>`).join('')}
                    </table>
                    `;
    }
}
class GemsReportBookSearch extends GemsReport
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_id":"gems_prompt",
        }
        this.html = `
                <table class="w3-table-all w3-margin-bottom">
                    <tr class="w3-theme-d1">
                        <th>Barcode</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Classroom</th>
                        <th>Status</th><th></th><th></th><th></th><th></th><th></th>
                    </tr>
                    ${this.prompt_data["search_results"].map(row=>
                        `<tr class="gems_result_row">
                            <td class="gems_entry" data-key="id" value="${row['id']}" style="display:none">${row['id']}</td>
                            <td class="gems_entry" data-key="category"  style="display:none">Book</td>
                            <td class="gems_entry" data-key="barcode">${row["barcode"]}</td>
                            <td class= data-key="name">${row["name"]}</td>
                            <td>${row["author"]}</td>
                            <td class="gems_entry" data-key="classroom">${row["classroom"]}</td>
                            <td>${row["status"]}</td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqGenerateDetails, event)">Details</button></td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqGenerateHistory, event)">History</button></td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqCopyEducationalAsset, event)">Copy</button></td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqEditEducationalAsset, {'category':'Book', 'event':event})">Edit</button></td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqDeleteEducationalAsset, event)">Delete</button></td>
                        </tr>`
                    ).join('')}
                </table>
        `;
    }
    display()
    {
        document.getElementById("gems_book_search_results").insertAdjacentHTML('afterbegin',this.html);
    }
}
class GemsReportItemSearch extends GemsReport
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_id":"gems_prompt",
        }
        this.html = `
                <table class="w3-table-all w3-margin-bottom">
                    <tr class="w3-theme-d1">
                        <th>Barcode</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Classroom</th>
                        <th>Status</th><th></th><th></th><th></th><th></th><th></th>
                    </tr>
                    ${this.prompt_data["search_results"].map(row=>
                        `<tr class="gems_result_row">
                            <td class="gems_entry" data-key="id" value="${row['id']}" style="display:none">${row['id']}</td>
                            <td class="gems_entry" data-key="category"  style="display:none">Item</td>
                            <td class="gems_entry" data-key="barcode">${row["barcode"]}</td>
                            <td  data-key="name">${row["name"]}</td>
                            <td>${row["category"]}</td>
                            <td>${row["classroom"]}</td>
                            <td>${row["status"]}</td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqGenerateDetails, event)">Details</button></td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqGenerateHistory, event)">History</button></td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqCopyEducationalAsset, event)">Copy</button></td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqEditEducationalAsset, {'category':'Item', 'event':event})">Edit</button></td>
                            <td><button class="w3-button w3-theme-d5 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqDeleteEducationalAsset, event)">Delete</button></td>
                        </tr>`
                    ).join('')}
                </table>
        `;
    }
    display()
    {
        document.getElementById("gems_item_search_results").insertAdjacentHTML('afterbegin',this.html);
    }
}
class GemsReportDisplayStudent extends GemsReport 
{
    
    constructor(prompt_data)
    {
        super()
        this.prompt_data = prompt_data;
        this.modalParams={
                            "report_id":"gems_report"
                        };
        this.html   =  `
                        <div id=${this.modalParams["report_id"]}>
                            <div id="gems_student_information" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                                <h5 class="w3-center w3-theme-d3" >Student Information Page</h5>
                                <table id="gems_student_table" class="w3-table-all w3-hoverable w3-margin-top">
                                    <tr class="w3-theme-l1">
                                        <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                                        <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                                        <th>First Name</th><th>Unit</th><th>Institution</th><th>Date Entered</th>
                                    </tr>
                                    ${this.prompt_data.map(row => `<tr class="item"  onclick=""><td>${row['IDOC']}</td><td>${row['last_name']}</td>
                                    <td>${row['first_name']}</td><td>${row['housing_unit']}</td><td>${row['institution']}</td><td>${row['entry_date']}</td></tr>`).join('')}
                                </table>
                            <br></div>  
                            
                            
                            <div id="gems_class_info_toggle" class="w3-card-2 w3-round w3-margin-left w3-margin-bottom w3-theme-d1 gems_toggle_off" style="padding:8px 16px;cursor:pointer;" onclick="$('#gems_class_info').slideToggle('slow');$('#gems_class_info_caret').toggleClass('fa-caret-right');toggleGemsWorker('gems_class_info', '../static/gems/js/gems_ww_class_info.js', {'toggle_state':this.classList,'ww_context':${this.prompt_data[0]['id']}});">Class Information
                                <i id="gems_class_info_caret" class="fa fa-caret-down w3-right"></i></div>
                            <div id="gems_class_info" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom" style="display:none">
                                <div class="w3-container w3-margin-top">
                                    <button onclick="gems_controller.initGemsRequest(GemsReqAddEnrollmentRecord,{'student_id':${this.prompt_data[0]['id']}})" class="w3-button w3-theme-d3 ">Add Student to Class</button>
                                    <div class="w3-theme-l1  w3-panel w3-padding" >  Add an enrollment record by clicking the "Add" button. A few seconds later the updated record will be displayed below.</div>
                                </div>
                                <div id="gems_class_info_table" class="w3-container w3-small">

                                </div>
                            </div>    

                          
                            <div id="gems_test_history_toggle" class="w3-card-2 w3-round w3-margin-left w3-margin-bottom w3-theme-d1 gems_toggle_off" style="padding:8px 16px;cursor:pointer;" onclick="$('#gems_test_history').slideToggle('slow');$('#gems_test_history_caret').toggleClass('fa-caret-right');toggleGemsWorker('gems_test_history', '../static/gems/js/gems_ww_test_history.js', {'toggle_state':this.classList,'ww_context':${this.prompt_data[0]['id']}})">Test History
                                <i id="gems_test_history_caret" class="fa fa-caret-down w3-right"></i></div>
                            <div id="gems_test_history" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom"  style="display:none">
                                <p><button onclick="gems_controller.initGemsRequest(GemsReqAddTestRecord,{'student_id':${this.prompt_data[0]['id']}})" class="w3-button w3-theme-d3 w3-margin-left">Add Test Score</button></p>
                                <div id="gems_test_history_table" class="w3-container w3-responsive  w3-small">
                                
                                </div>
                                </div>
                                              
                            
                            <div id="gems_item_checkout_toggle" class="w3-card-2 w3-round w3-margin-left w3-margin-bottom w3-theme-d1 gems_toggle_off" style="padding:8px 16px;cursor:pointer;" onclick="$('#gems_item_checkout').slideToggle('slow');$('#gems_item_checkout_caret').toggleClass('fa-caret-right');toggleGemsWorker('gems_item_checkout', '../static/gems/js/gems_ww_item_checkout.js', {'toggle_state':this.classList,'ww_context':${this.prompt_data[0]['id']}})">Items Checked Out
                                <i id="gems_item_checkout_caret" class="fa fa-caret-down w3-right"></i></div>
                            <div id="gems_item_checkout" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom"  style="display:none">
                                <p><button onclick="gems_controller.initGemsRequest(GemsReqCheckoutEducationalAsset,{'student_id':${this.prompt_data[0]['id']}})" class="w3-button w3-theme-d3 w3-margin-left-">Check-out Item</button></p> 
                                <div id="gems_item_checkout_table" class="w3-container w3-responsive  w3-small">
                                
                                </div>
                                </div>
                                
                                    
                            <div id="gems_moodle_information_toggle" class="w3-card-2 w3-round w3-margin-left w3-margin-bottom w3-theme-d1 gems_toggle_off" style="padding:8px 16px;cursor:pointer;" onclick="$('#gems_moodle_information').slideToggle('slow');$('#gems_moodle_information_caret').toggleClass('fa-caret-right');toggleGemsWorker('gems_moodle_information', '../static/gems/js/gems_ww_moodle_information.js',{'toggle_state':this.classList,'ww_context':${this.prompt_data[0]['id']}})">Moodle Test Information<i id="gems_moodle_information_caret" class="fa fa-caret-down w3-right"></i></div>
                            <div id="gems_moodle_information" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom"  style="display:none"> 
                                   <br>
                                   <input class="w3-input" style="width:50%;float:left;" oninput="w3.filterHTML('#gems_moodle_info', '.moodle_item', this.value)" placeholder="Filter for Test Name, Final Grade, or Date Taken here..">
                                    &nbsp;<br><br>
                                    <div id="gems_moodle_information_table" class="w3-responsive w3-container w3-small">
                                    
                                    
                                    
                                    </div><hr>
                            </div>
                              
                            <div id="gems_student_comment_toggle" class="w3-card-2 w3-round w3-margin-left w3-margin-bottom w3-theme-d1 gems_toggle_off" style="padding:8px 16px;cursor:pointer;" onclick="$('#gems_student_comment').slideToggle('slow');$('#gems_student_comment_caret').toggleClass('fa-caret-right');toggleGemsWorker('gems_student_comment', '../static/gems/js/gems_ww_student_comment.js', {'toggle_state':this.classList,'ww_context':${this.prompt_data[0]['id']}})">Student Comments
                                <i id="gems_student_comment_caret" class="fa fa-caret-down w3-right"></i></div>
                            <div id="gems_student_comment" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom"  style="display:none">
                                <p><button onclick="gems_controller.initGemsRequest(GemsReqAddStudentComment,{'student_id':${this.prompt_data[0]['id']}})" class="w3-button w3-theme-d3 w3-margin-left-">Add Comment</button></p> 
                                <div id="gems_student_comment_table" class="w3-container w3-responsive  w3-small">
                                
                                </div>
                                </div>
                        </div>
                    `;          
    }   
}
class GemsReportUserTimesheet extends GemsReport
{
    constructor(prompt_data,current_entry)
    {
        super();
        this.request_month = "";
        this.current_date = new Date();
        this.modal_params =  {};
        this.processPromptData(prompt_data);
        this.processModalParams(current_entry);
        this.html = ` 
        <div class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">    

            <h5 class="w3-center w3-theme-d3">Time Card Information</h5>
            <div class="w3-center">
                This is your time card information.<br>Select a date and accompanying times below to add an entry to your time card.<br>If you want to edit or delete a date do so by viewing the month.<br>
                <table class="w3-table-all w3-margin-bottom " sytle="" onkeyup="">
                    <tr class="w3-theme-d1"><th>Date to Add</th><th>Time In AM</th><th>Time Out AM</th><th>Time In PM</th><th>Time Out PM</th><th></th></tr>
                    <tr><td><input id="gems_timesheet_add_date" class="w3-input" type="date" value="${this.modal_params['entryDate']}" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format."></td>
                    <td><input id="gems_timesheet_timeInAM" class="w3-input gems_timesheet_add_time" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.modal_params["timeInAM"]}"></td>
                    <td><input id="gems_timesheet_timeOutAM" class="w3-input gems_timesheet_add_time" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.modal_params["timeOutAM"]}"></td>
                    <td><input id="gems_timesheet_timeInPM" class="w3-input gems_timesheet_add_time" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title=a"Please enter time in 24-hour time format(ie. 13:00)" value="${this.modal_params["timeInPM"]}"></td>
                    <td><input id="gems_timesheet_timeOutPM" class="w3-input gems_timesheet_add_time" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.modal_params["timeOutPM"]}"></td>
                    <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqUserTimesheetAddEntry,this.current_entry);">Add</button></td></tr>
                </table>
            </div>
        </div>
        <div class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                <div class="w3-content w3-margin">
                    <div class="w3-theme-l1 w3-padding  w3-center" style="display:inline">Select month to view that months time card information.</div>
                    <select id="gems_timesheet_select_month" class="w3-select w3-margin-left" style="width:150px;" name="date"><option value="${this.modal_params["current_month"]}">Current Month</option>
                        <option value="01">January</option><option value="02">February</option><option value="03">March</option><option value="04">April</option>
                        <option value="05">May</option><option value="06">June</option><option value="07">July</option><option value="08">August</option>
                        <option value="09">September</option><option value="10">October</option><option value="11">November</option><option value="12">December</option>
                    </select>
                    <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqUserTimesheet)">View Month</button>
                </div>
                <table class="w3-table-all w3-margin-bottom w3-margin-top"> 
                    <tr class="w3-theme-d1">
                        <th>IDOC</th><th>Date</th><th>Time In AM</th><th>Time Out AM</th><th>Time In PM</th><th>Time Out PM</th><th></th><th></th>
                    </tr>
                    ${this.prompt_data.map(row=>`
                    <tr class="gems_timesheet_row">
                        <td class="gems_timesheet_entry" data-key="IDOC">${row["IDOC"]}</td>
                        <td class="gems_timesheet_entry" data-key="entryDate">${row["entryDate"]}</td>
                        <td class="gems_timesheet_entry" data-key="timeInAM">${row["timeInAM"]}</td>
                        <td class="gems_timesheet_entry" data-key="timeOutAM">${row["timeOutAM"]}</td>
                        <td class="gems_timesheet_entry" data-key="timeInPM">${row["timeInPM"]}</td>
                        <td class="gems_timesheet_entry" data-key="timeOutPM">${row["timeOutPM"]}</td>
                        <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqUserTimesheetEditEntry,event);">Edit</button></td>
                        <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqUserTimesheetDelEntry,event);">Delete</button></td>`).join('')}
                    </tr>
                </table>
             </div>   
        </div>
                    `;
    }
    //a method that removes the month requested from the prompt_data object and adds it to this.modalParams
    processPromptData(prompt_data)
    {
        for (var o of prompt_data) {
            if (o.reqMonth) {
               var r = prompt_data.pop(o);
            }
        }
        (r.reqMonth == "0") ? this.request_month = new Date().toISOString().slice(5,7) :this.request_month = r.reqMonth;
        this.prompt_data = prompt_data;

    }
    processModalParams(current_entry)
    {
        let current_date = new Date();
        this.modal_params["current_month"] = current_date.toISOString().slice(5,7);
        current_entry ?  this.modal_params["timeInAM"] = current_entry["timeInAM"] : this.modal_params["timeInAM"] = "08:00";
        current_entry ?  this.modal_params["timeOutAM"] = current_entry["timeOutAM"] : this.modal_params["timeOutAM"] = "11:00";
        current_entry ?  this.modal_params["timeInPM"] = current_entry["timeInPM"] :  this.modal_params["timeInPM"] = "12:00";
        current_entry ?  this.modal_params["timeOutPM"] = current_entry["timeOutPM"] :   this.modal_params["timeOutPM"] = "15:30";
        current_entry ?  this.modal_params["entryDate"] = current_entry["entryDate"] :  this.modal_params["entryDate"] = current_date.toISOString().slice(0,10);   
    }
}
class GemsReportTestManagement extends GemsReport
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header":"Test Administration",
            "prompt_message":"Here is where you may add, edit, and delete tests in the database.<br> These are the tests that are available for students to take and score.",
            "prompt_warning": " <p> Warning: It is not advisable to delete a test in the database.  <br> Doing so will delete all student scores related to that test.  <br>Instead simply edit the test and select \"No\" in the  \"Active\" input.</p> ",
            "prompt_id":"gems_prompt",
            "modal_on_submit": "",
            "modal_on_cancel": ""
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                    <h5 class="w3-center w3-theme-d3">${this.modal_params["prompt_header"]}</h5>
                    <div class=" w3-theme-l1 w3-margin-bottom w3-margin-top w3-center w3-padding" >
                            ${this.modal_params["prompt_message"]} 
                    </div>
                    <div class="w3-content w3-center"><button class=" w3-theme-d3 w3-button" onclick="gems_controller.initGemsRequest(GemsReqAdminAddTest)">Add a Test</button></div>
                    <div class="w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red">
                        ${this.modal_params["prompt_warning"]} 
                    </div>
                    <table class="w3-table-all w3-margin-bottom w3-margin-top"> 
                        <tr class="w3-theme-d1">
                            <th>Test ID</th><th>Test Name</th><th>Passing Score</th><th>Active</th><th>Certificate</th><th></th><th></th>
                        </tr>
                        <tr>
                            ${this.prompt_data.map(row=>`<tr class="gems_test_row"><td class="gems_test_entry" data-key="id">${row["id"]}</td><td class="gems_test_entry" data-key="name">${row["name"]}</td>
                            <td class="gems_test_entry" data-key="passing_score">${row["passing_score"]}</td><td class="gems_test_entry" data-key="active">${row["active"]}</td>
                            <td class="gems_test_entry" data-key="certificate">${row["certificate"]}</td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqAdminEditTest,event)">Edit</button></td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqAdminDelTest,event)">Delete</button></td>`).join('')}
                        </tr>
                </table>
                </div>
        `;
    }
}
class GemsReportClassTSManagement extends GemsReport 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Class Administration",
            "prompt_message": "Here is where you may manage the scheduling of classes.<br> These are class timeslots that students may be enrolled in.",
            "prompt_warning": " <p> Warning:<br> Deleting a class timeslot will delete all enrollment records associated with that timeslot.  <br> Deleting a class will also delete all associated timeslots.  <br>So be very careful as these transactions are permanent.</p> ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "",
            "modal_on_cancel": ""
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                    <h5 class="w3-center w3-theme-d3">${this.modal_params["prompt_header"]}</h5>
                    <div class="w3-theme-l1 w3-margin-bottom w3-margin-top w3-center w3-padding" >
                            ${this.modal_params["prompt_message"]} 
                    </div>
                    <div class="w3-content w3-center"><button class=" w3-theme-d3 w3-button" onclick="gems_controller.initGemsRequest(GemsReqAddClassTimeslot)">Add a Class timeslot</button></div>
                    <div class="w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red">
                        ${this.modal_params["prompt_warning"]} 
                    </div>
                    <table class="w3-table-all w3-margin-bottom w3-margin-top"> 
                        <tr class="w3-theme-d1">
                            <th>Timeslot ID</th><th>Subject</th><th>Teacher</th><th>Classroom</th><th>Hour</th><th></th><th></th>
                        </tr>
                        <tr>
                            ${this.prompt_data.map(row=>`<tr class="gems_class_row"><td class="gems_class_entry" data-key="id">${row["id"]}</td><td class="gems_class_entry" data-key="subject">${row["subject"]}</td>
                            <td class="gems_class_entry" data-key="teacher">${row["teacher"]}</td><td class="gems_class_entry" data-key="classroom">${row["classroom"]}</td>
                            <td class="gems_class_entry" data-key="hour">${row["hour"]}</td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqEditClassTimeslot,event)">Edit</button></td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqDelClassTimeslot,event)">Delete</button></td>`).join('')}
                        </tr>
                </table>
                </div>
        `;
    }
}
class GemsReportClassManagement extends GemsReport 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Class Administration",
            "prompt_message": "Here is where you may add classes for scheduling and enrollment.<br> A class in GEMS consists of a subject, a teacher and a location (or classroom). ",
            "prompt_warning": " <p> Warning:<br> Deleting a class will delete all associated timeslot and enrollment records.  <br>So be very careful as these transactions are permanent.</p> ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "",
            "modal_on_cancel": ""
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                    <h5 class="w3-center w3-theme-d3">${this.modal_params["prompt_header"]}</h5>
                    <div class="w3-theme-l1 w3-margin-bottom w3-margin-top w3-center w3-padding" >
                            ${this.modal_params["prompt_message"]} 
                    </div>
                    <div class="w3-content w3-center"><button class=" w3-theme-d3 w3-button" onclick="gems_controller.initGemsRequest(GemsReqAdminAddClass)">Add a Class</button></div>
                    <div class="w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red">
                        ${this.modal_params["prompt_warning"]} 
                    </div>
                    <table class="w3-table-all w3-margin-bottom w3-margin-top"> 
                        <tr class="w3-theme-d1">
                            <th>Class ID</th><th>Subject</th><th>Teacher</th><th>Classroom Number</th><th></th><th></th>
                        </tr>
                        <tr>
                            ${this.prompt_data.map(row=>`<tr class="gems_result_row"><td class="gems_entry" data-key="id">${row["id"]}</td><td class="gems_entry" data-key="subject">${row["subject"]}</td>
                            <td class="gems_entry" data-key="teacher">${row["teacher"]}</td><td class="gems_entry" data-key="classroom"> ${row["classroom"]}</td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqAdminEditClass,event)">Edit</button></td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqAdminDelClass,event)">Delete</button></td>`).join('')}
                        </tr>
                </table>
                </div>
        `;
    }
}
class GemsReportSubjectManagement extends GemsReport 
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header": "Subject Administration",
            "prompt_message": "Here is where you may add subjects in order to compose classes.<br> ",
            "prompt_warning": "  ",
            "prompt_id": "gems_prompt",
            "modal_on_submit": "",
            "modal_on_cancel": ""
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                    <h5 class="w3-center w3-theme-d3">${this.modal_params["prompt_header"]}</h5>
                    <div class="w3-theme-l1 w3-margin-bottom w3-margin-top w3-center w3-padding" >
                            ${this.modal_params["prompt_message"]} 
                    </div>
                    <div class="w3-content w3-center"><button class=" w3-theme-d3 w3-button" onclick="gems_controller.initGemsRequest(GemsReqAdminAddSubject)">Add a Subject</button></div>
                    <div class="w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red">
                        ${this.modal_params["prompt_warning"]} 
                    </div>
                    <table class="w3-table-all w3-margin-bottom w3-margin-top"> 
                        <tr class="w3-theme-d1">
                            <th>Subject ID</th><th>Subject Name</th><th></th>
                        </tr>
                        <tr>
                            ${this.prompt_data.map(row=>`<tr class="gems_result_row">
                            <td class="gems_entry" data-key="id">${row["id"]}</td>
                            <td class="gems_entry" data-key="name">${row["name"]}</td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqAdminDelSubject,event)">Delete</button></td>`).join('')}
                        </tr>
                </table>
                </div>
        `;
    }
}
class GemsReportEnterStudentBarcodes extends GemsReport
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"This is a preview of the report.",
                                "modal_on_submit":"gems_controller.initGemsRequest(GemsReqDelStudent,event)"
                            };
        this.html = ` 
                    <div class="w3-container">
                        <div class="w3-content w3-theme-l1 w3-margin-bottom w3-padding w3-center">
                                ${this.modal_params["prompt_message"]}
                        </div>
                        ${this.prompt_data["barcodes"].map(row=>`<div class="w3-col m2 w3-padding-24" style="font-family:barcode">"${row}"</div>`).join('')}
                    </div>
                    `;
    }
    display()
    {
        //target div in the print barcode report
        document.getElementById("gems_prompt_barcode_preview").insertAdjacentHTML("afterbegin", this.html);
    }
}
class GemsReportDisplayDailyAttendance extends GemsReport
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_message": "",
            "modal_on_submit": "gems_controller.initGemsRequest(GemsReqDelStudent,event)"
        };
        this.html = ` <div class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                        <div class="w3-content w3-theme-l1 w3-margin-bottom w3-padding w3-center">
                                Displaying attendance for ${this.prompt_data["class_timeslot"]} on ${this.prompt_data["display_date"]}
                        </div>
                        <table id="gems_display_attendance" class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                            <tr class="w3-theme-d1">
                                <th onclick="w3.sortHTML('#gems_display_attendance','.gems_result_row','td:nth-child(1)')">IDOC</th>
                                <th onclick="w3.sortHTML('#gems_display_attendance','.gems_result_row','td:nth-child(2)')">Last Name</th>
                                <th>First Name</th><th>Scan Date</th><th>Scan Time</th><th>Class</th>
                            </tr>
                            ${this.prompt_data["attendance"].map(row => `
                            <tr class="gems_result_row"  onclick=" ">
                                <td  data-key="IDOC">${row['IDOC']}</td><td data-key="last_name">${row['last_name']}</td><td data-key="first_name">${row['first_name']}</td>
                                <td  data-key="scan_date">${row['scan_date']}</td><td data-key="scan_time">${row['scan_time']}</td><td data-key="class" >${row['class']}</td></tr>`).join('')}
                        </table>
                    </div>
                    `;
    }
}
class GemsReportDisplayIndividualAttendance extends GemsReport
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_message": "",
            "modal_on_submit": "gems_controller.initGemsRequest(GemsReqDelStudent,event)"
        };
        this.html = ` <div class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                        <div class="w3-content w3-theme-l1 w3-margin-bottom w3-padding w3-center">
                                Displaying attendance for ${this.prompt_data["student"]["last_name"]}, ${this.prompt_data["student"]["first_name"]} #${this.prompt_data["student"]["IDOC"]}
                        </div>
                        <table id="gems_display_attendance" class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                            <tr class="w3-theme-d1">
                                <th onclick="w3.sortHTML('#gems_display_attendance','.gems_result_row','td:nth-child(1)')">IDOC</th>
                                <th onclick="w3.sortHTML('#gems_display_attendance','.gems_result_row','td:nth-child(2)')">Last Name</th>
                                <th>First Name</th><th>Scan Date</th><th>Scan Time</th><th>Class Timeslot</th>
                            </tr>
                            ${this.prompt_data["attendance"].map(row => `
                            <tr class="gems_result_row"  onclick=" ">
                                <td  data-key="IDOC">${row['IDOC']}</td><td data-key="last_name">${row['last_name']}</td><td data-key="first_name">${row['first_name']}</td>
                                <td  data-key="scan_date">${row['scan_date']}</td><td data-key="scan_time">${row['scan_time']}</td><td data-key="class" >${row['class']}</td></tr>`).join('')}
                        </table>
                    </div>
                    `;
    }
}
class GemsReportDisplayReports extends GemsReport
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_message": "Select a report category",
        };
        this.html = `
                    <div class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                            
                         <div class="w3-content w3-theme-d3 w3-margin-bottom w3-padding w3-center">
                                ${this.modal_params["prompt_message"]}
                        </div>
                        <div class="w3-container w3-responsive">
                            <div class="w3-bar w3-theme-d5">
                                <button class="w3-bar-item w3-button w3-theme-l1 reporttablink" onclick="gemsOpenReport(event,'AttendanceCallout')">Attendance/Callout</button>
                                <button class="w3-bar-item w3-button reporttablink" onclick="gemsOpenReport(event,'BooksItems')">Educational Assets</button>
                                <button class="w3-bar-item w3-button reporttablink" onclick="gemsOpenReport(event,'Tests');">Tests</button>
                            </div>
                            <div id="AttendanceCallout" class="w3-container w3-border reportlist">
                                <h3>Attendance and Callout Reports</h3>
                                <p>Here is where you will generate reports pertaining to Attendance and Callouts.</p>
                                <hr>
                                <h4>Generate Callout to CSV</h4>
                                <p>This will generate a callout CSV file that can be downloaded and put into a spreadsheet program.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateCalloutCSV)">Run Report</button>
                                <hr>
                                <h4>Generate Class Roster</h4><!-- TODO FINISH THIS -->
                                <p>This report will generate a class roster the chosen class.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateClassRoster)">Run Report</button>
                                <hr>
                                <h4>Generate Enrolled Students List</h4>
                                <p>This report will give you only a list of students that are enrolled in a specific classroom.  Will not show schedule of student.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateEnrolledStudents)">Run Report</button>
                                <hr>
                                <h4>Print Daily Attendance</h4>
                                <p>This report display the students that scanned in for the select classroom, date, hour.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateDailyAttendance)">Run Report</button>
                                <hr>
                                <h4>Contact Hours</h4>
                                <p>This report will display the contact hours with the students between(and including) two dates.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateContactHours)">Run Report</button>
                                <hr>
                                <h4>Attendance Scan Report</h4>
                                <p>This report will check which students who have a scheduled class and did not scan in.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateAttendanceScan)">Run Report</button>
                                <hr>
                            </div>
                            <div id="BooksItems" class="w3-container w3-border reportlist" style="display:none">
                                <h3>Educational Assets Reports</h3>
                                <p>Here is where you will find reports related to Books and Items that can be checked out</p>
                                <hr>
                                <h4>Educational Assets Currently Out</h4>
                                <p>This will display the current items out for the selected classroom.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateAssetsOut)">Run Report</button>
                                <hr>
                                <h4>Educational Assets Currently In</h4>
                                <p>This will display the current items available for the selected classroom.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateAssetsIn)">Run Report</button>
                                <hr>
                                <h4>Educational Assets Classoom Inventory</h4>
                                <p>This report will display all of the educational assets for a selected classroom.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateClassroomInventory)">Run Report</button>
                                <hr>
                            </div>
                            <div id="Tests" class="w3-container w3-border reportlist" style="display:none">
                                <h3>Test Report</h3>
                                <p>Here is where you will run reports on test scores that are entered into the database</p>
                                <hr>
                                <h4>Test Score History</h4>
                                <p>This report will generate a list of test scores between two dates for a specific test name.</p>
                                <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqGenerateTestHistory)">Run Report</button>
                                <hr>
                            </div>
                        </div>
                    </div>


        `;
    }
}
class GemsReportManageEducationalAssets extends GemsReport
{
     constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_message": "Manage Educational Assets",
        };
        this.html = ` <div class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                         <div class="w3-content w3-theme-d3 w3-margin-bottom w3-padding w3-center">
                                ${this.modal_params["prompt_message"]}
                        </div>
                        <div class="w3-container w3-responsive">
                            <div class="w3-bar w3-theme-d5 ">
                                <button class="w3-bar-item w3-button w3-theme-l1 reporttablink" onclick="gemsOpenReport(event,'manage_books')">Books</button>
                                <button class="w3-bar-item w3-button reporttablink" onclick="gemsOpenReport(event,'manage_items')">Items</button>
                            </div>
                            <div id="manage_books" class="w3-container w3-border reportlist">
                                <div class="w3-row w3-margin-bottom">
                                    <div class="w3-twothird">
                                        <h3 >Book Management</h3>
                                        <p>Search for a book by barcode, author, or title.<br>Filter by classroom.</p>
                                    </div>
                                    <div class="w3-third">
                                        <button class="w3-button w3-theme-d5" style="margin:45px 0px 45px 0px;padding:12px;" onclick="gems_controller.initGemsRequest(GemsReqAddEducationalAsset,{'category':'Book'})">Add a Book</button>
                                    </div>
                                </div>
                                <div class="w3-row w3-margin-bottom">
                                    <select class="w3-third w3-input gems_user_input" id="gems_classroom_select" data-key="classroom_select">
                                        <option value="All">All Classrooms</option>
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <hr><hr>
                                    <input class="w3-input w3-third w3-margin-right gems_user_input" data-key="search" placeholder="Search for a book..." onkeyup="if (event.keyCode == 13) {gems_controller.initGemsRequest(GemsReqBookSearch)}"></input>
                                    <button class="w3-button w3-theme-d5 w3-quarter w3-margin-right" onclick="gems_controller.initGemsRequest(GemsReqBookSearch)" >Search</button>
                                    <button class="w3-button  w3-theme-d5 w3-quarter w3-margin-right" onclick="$('#gems_book_search_results').empty()">Clear Results</button>
                                </div>
                                <hr>
                                <div id="gems_book_search_results">

                                </div>
                            </div>
                            <div id="manage_items" class="w3-container w3-border reportlist" style="display:none">
                                <div class="w3-row w3-margin-bottom">
                                    <div class="w3-twothird">
                                        <h3 >Item Management</h3>
                                        <p>Search for an item by barcode, or by it's name.</p>
                                    </div>
                                    <div class="w3-third">
                                        <button class="w3-button w3-theme-d5" style="margin:45px 0px 45px 0px;padding:12px;" onclick="gems_controller.initGemsRequest(GemsReqAddEducationalAsset,{'category':'Item'})">Add an Item</button>
                                    </div>
                                </div>
                                <div class="w3-row w3-margin-bottom">
                                    <select class="w3-third w3-input gems_user_input" id="gems_classroom_select" data-key="classroom_select">
                                        <option value="All">All Classrooms</option>
                                        ${this.prompt_data.map(row=>`<option value="${row["id"]}">${row["name"]}</option>`).join('')}
                                    </select>
                                    <hr><hr>
                                    <input class="w3-input w3-third w3-margin-right gems_user_input" data-key="search" placeholder="Search for an item..." onkeyup="if (event.keyCode == 13) {gems_controller.initGemsRequest(GemsReqItemSearch)}"></input>
                                    <button class="w3-button w3-theme-d5 w3-quarter w3-margin-right" onclick="gems_controller.initGemsRequest(GemsReqItemSearch)" >Search</button>
                                    <button class="w3-button  w3-theme-d5 w3-quarter w3-margin-right" onclick="$('#gems_item_search_results').empty()">Clear Results</button>
                                </div>
                                <hr>
                                <div id="gems_item_search_results">
                                
                                </div>
                            </div>
                        </div>
                    </div>


        `;
    }
} 
class GemsReportEnterAssetBarcodes extends GemsReport
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"This is a preview of the report.",
                                "modal_on_submit":""
                            };
        this.html = ` 
                    <div class="w3-container">
                        <div class="w3-content w3-theme-l1 w3-margin-bottom w3-padding w3-center">
                                ${this.modal_params["prompt_message"]}
                        </div>
                        ${this.prompt_data["barcodes"].map(row=>`<div class="w3-col m2 w3-padding-24" style="font-family:barcode">"${row}"</div>`).join('')}
                    </div>
                    `;
    }
    display()
    {
        //target div in the print barcode report
        document.getElementById("gems_prompt_barcode_preview").insertAdjacentHTML("afterbegin", this.html);
    }
}
