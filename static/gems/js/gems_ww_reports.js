/*
    *gems_SSE_reports.js
      
  
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
    * Information:
    * 
    * Recieves the response data and composes process of creating a report table.
    * The display method writes the template literal to the DOM at a pre-existing div.
*/
class GemsWWReport
{
    constructor()
    {

    }
    display()
    {
        document.getElementById(this.target).insertAdjacentHTML("afterbegin", html);
    }
    clearTarget()
    {
        $("#"+this.target).empty();
    }
    updateHTML(response_data)
    {
        if(response_data[0] == undefined || response_data[0]["result"] == 1) {
            //do nothing if undefined, or if no information is available.
            this.response_data = [];
        } else {
            this.response_data = response_data;
        }
    }
}
class GemsReport_class_info extends GemsWWReport
{
    constructor()
    {
        super();
        this.target = "gems_class_info_table";
        this.response_data = [{
                "student_id": "","class_timeslot_id":"",
                "subject": "", "teacher": "", "classroom": "",
                "hour": "", "day": "", 
        }];
    }
    formatDays()
    {
        for (let record of this.response_data) {
            var days = {
                    "Monday":"",
                    "Tuesday":"",
                    "Wednesday":"",
                    "Thursday":"",
                    "Friday":"",
            }
            for (const [key,value] of Object.entries(days)) {
                record.day.includes(key) ? days[key] = "checked": days[key] = "";
            }
            record.days = days;
        }
    }
    display()
    {
        this.formatDays();

        let html = `<table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                        <tr class="w3-theme-d1">
                            <th>Subject</th><th>Teacher</th><th>Room Number</th><th>Hour</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Enrollment Date</th><th></th><th></th> 
                        </tr>
                        ${this.response_data.map(row => `<tr class="gems_result_row" >
                        <td class="gems_entry" data-key="student_id" style="display:none">${row['student_id']}</td>
                        <td class="gems_entry" data-key="class_timeslot_id" style="display:none">${row['class_timeslot_id']}</td>
                        <td class="gems_entry" data-key="subject">${row['subject']}</td>
                        <td class="gems_entry" data-key="teacher">${row['teacher']}</td>
                        <td class="gems_entry" data-key="classroom">${row['classroom']}</td>
                        <td class="gems_entry" data-key="hour">${row['hour']}</td>
                        <td class="gems_entry" data-key="monday"><input type="checkbox" disabled ${row["days"]["Monday"]}></input></td>
                        <td class="gems_entry" data-key="tuesday"><input type="checkbox" disabled ${row["days"]["Tuesday"]}></input></td>
                        <td class="gems_entry" data-key="wednesday"><input type="checkbox" disabled ${row["days"]["Wednesday"]}></input></td>
                        <td class="gems_entry" data-key="thursday"><input type="checkbox" disabled ${row["days"]["Thursday"]}></input></td>
                        <td class="gems_entry" data-key="friday"><input type="checkbox" disabled ${row["days"]["Friday"]}></input></td>
                        <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqEditEnrollmentRecord, event)">Edit</button></td>
                        <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqDelEnrollmentRecord, event)">Delete</button></td></tr>`).join('')}
                    </table>

        `;
        document.getElementById(this.target).insertAdjacentHTML("afterbegin", html);
    }
        
}
class GemsReport_test_history extends GemsWWReport
{
    constructor()
    {
        super();
        this.target = "gems_test_history_table";
        // this.response_data = [{
        //     "id": "", "test": "", "test_score": "",
        //     "cert_printed": "", "test_date": "",
        // }];
    }
    display()
    {
         let html = `<table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                            <tr class="w3-theme-d1">
                                <th>Test Name</th><th>Test Score</th><th>Certificate Printed</th><th>Test Date</th><th></th><th></th> 
                            </tr>
                            ${this.response_data.map(row => `<tr class="gems_result_row" >
                            <td class="gems_entry" data-key="id" value="${row['id']}" style="display:none">${row['id']}</td>
                            <td class="gems_entry" data-key="test">${row['test']}</td><td class="gems_entry" data-key="test_score">${row['test_score']}</td>
                            <td class="gems_entry" data-key="cert_printed">${row['cert_printed']}</td>
                            <td class="gems_entry" data-key="test_date" >${row['test_date']}</td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqEditTestRecord, event)">Edit</button></td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqDelTestRecord, event)">Delete</button></td></tr>`).join('')}
                        </table>

            `;
         document.getElementById(this.target).insertAdjacentHTML("afterbegin", html);
    }
}
class GemsReport_item_checkout extends GemsWWReport
{
    constructor()
    {
        super();
        this.target = "gems_item_checkout_table";
        // this.response_data = [{
        //     "id": "", "name": "", "barcode": "",
        //     "classroom": "", "checkout_date": "",
        //     "due_date": "", "category":"",
        // }];
    }
    display()
    {
         let html = `<table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                            <tr class="w3-theme-d1">
                                <th>Barcode</th><th>Name</th><th>Classroom</th><th>Category</th><th>Checkout Date</th><th>Due Date</th><th></th> <th></th>
                            </tr>
                            ${this.response_data.map(row => `<tr class="gems_result_row" >
                            <td class="gems_entry" data-key="id" value="${row['id']}" style="display:none">${row['id']}</td>
                            <td class="gems_entry" data-key="barcode">${row['barcode']}</td><td class="gems_entry" data-key="name">${row['name']}</td>
                            <td class="gems_entry" data-key="classroom">${row['classroom']}</td>
                            <td class="gems_entry" data-key="category">${row['category']}</td>
                            <td class="gems_entry" data-key="checkout_date" >${row['checkout_date']}</td>
                            <td class="gems_entry" data-key="due_date" >${row['due_date']}</td>
                            <td><button class="w3-button w3-theme-d3 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqCheckinEducationalAsset, event)">Check-In</button></td>
                            <td><button class="w3-button w3-theme-d3 w3-small" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqRenewEducationalAsset, event)">Renew</button></td></tr>`).join('')}
                        </table>

            `;
         document.getElementById(this.target).insertAdjacentHTML("afterbegin", html);
    }
}
class GemsReport_moodle_information extends GemsWWReport
{
    constructor()
    {
        super();
        // this.response_data = response_data;
        this.target = "gems_moodle_information_table";
    }
    display()
    {
         let html = `<table id="gems_moodle_info" class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                            <tr class="w3-theme-d1">
                                <th>Test Name</th><th>Final Grade</th><th>Passing Grade</th><th>Date Taken</th>
                            </tr>
                            ${this.response_data.map(row => `
                                <tr class="gems_result_row moodle_item" >
                                    <td class="gems_entry" data-key="id" value="${row['id']}" style="display:none">${row['id']}</td>
                                    <td class="gems_entry">${row['itemname']}</td>
                                    <td class="gems_entry" >${row['finalgrade']}</td>
                                    <td class="gems_entry" >${row['gradepass']}</td>
                                    <td class="gems_entry" >${row['timemod']}</td>
                                </tr>`).join('')}
                        </table>

            `;
         document.getElementById(this.target).insertAdjacentHTML("afterbegin", html);
    }
}
class GemsReport_student_comment extends GemsWWReport
{
    constructor()
    {
        super();
        // this.response_data = response_data;
        this.target = "gems_student_comment_table";
    }
    display()
    {
         let html = `<table id="gems_student_comment" class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                            <tr class="w3-theme-d1">
                                <th>Gems User</th><th>Last Name</th><th>Comment Date</th><th>Comment</th><th></th>
                            </tr>
                            ${this.response_data.map(row => `
                                <tr class="gems_result_row " >
                                    <td class="gems_entry" data-key="id" value="${row['id']}" style="display:none">${row['id']}</td>
                                    <td class="gems_entry">${row['user']}</td>
                                    <td class="gems_entry" >${row['last_name']}</td>
                                    <td class="gems_entry" >${row['entry_date']}</td>
                                    <td class="gems_entry" data-key="comment" >${row['comment']}</td>
                                    <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqDelStudentComment, event)">Delete</button></td>
                                </tr>`).join('')}
                        </table>

            `;
         document.getElementById(this.target).insertAdjacentHTML("afterbegin", html);
    }
}
class GemsReport_web_attend_table extends GemsWWReport
{
    constructor()
    {
        super();
        this.target = "gems_web_attend_table";
        this.response_data = [{
            "student": "", "classroom": "", "hour": "",
            "scan_time": "", "subject":"",
        }];
    }
    display()
    {
        let html = `<table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                            <tr class="w3-theme-d1">
                                <th>Student</th><th>Subject</th><th>Classroom</th><th>Hour</th><th>Scan</th>
                            </tr>
                            ${this.response_data.map(row => `<tr class="w3-small gems_result_row" >
                                <td class="gems_entry" data-key="student">${row['student']}</td>
                                <td class="gems_entry" data-key="subject">${row['subject']}</td>
                                <td class="gems_entry" data-key="classroom">${row['classroom']}</td>
                                <td class="gems_entry" data-key="hour">${row['hour']}</td>
                                <td class="gems_entry" data-key="scan_time" >${row['scan_time']}</td></tr>`).join('')}
                            
                    </table>

            `;
         document.getElementById(this.target).insertAdjacentHTML("afterbegin", html);
    }
}

/* <table id="gems_moodle_info2" class="w3-table-all w3-hoverable"><tr class="w3-theme-l3"><th>Test Name</th><th>Final Grade</th><th>Passing Grade</th><th>Date Taken</th></tr>
                                    </table> */
