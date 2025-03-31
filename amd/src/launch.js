// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

import $ from 'jquery';
import * as Str from 'core/str';

let id = '';
let cid = '';
// simplifiedlaunch is always set to true regardless of any settings.
let simplifiedlaunch = true;

let SELECTORS = {
    ATTEMPT_PROGRESS: '#tincanlaunch_attemptprogress',
    ATTEMPT_TABLE: '#tincanlaunch_attempttable',
    COMPLETION_CHECK: '#tincanlaunch_completioncheck',
    EXIT: '#tincanlaunch_exit',
    LAUNCH_FORM: '#launchform',
    MAINCONTENT: '#maincontent',
    NEW_ATTEMPT: '#tincanlaunch_newattempt',
    SIMPLIFIED: '#tincanlaunch_simplified',
    SIMPLIFIED_LINK: '[id^=tincanlaunch_simplifiedlink-]',
    NEW_ATTEMPT_LINK: '[id^=tincanlaunch_newattemptlink-]',
    REATTEMPT: '[id^=tincanrelaunch_attempt-]',
    REGISTRATION: '#launchform_registration',
    STATUSDIV: '#tincanlaunch_status',
    STATUSPARA: '#tincanlaunch_status_para'
};

export const init = (courseid) => {
    // Retrieve URL parameters
    let urlparams = new URLSearchParams(window.location.search);
    id = urlparams.get('id');
    cid = courseid;

    let simplifiedid = $(SELECTORS.SIMPLIFIED_LINK).attr('id').substring(28);
    launchExperience(simplifiedid);

    // Periodically check for completion every 30 seconds.
    setInterval(function() {
        $(SELECTORS.COMPLETION_CHECK).load('completion_check.php?id=' + id);
    }, 30000);
};

const keyTest = (keycode, registrationid) => {
    if (keycode === 'Enter' || keycode === ' ') {
        launchExperience(registrationid);
    }
};

const launchExperience = (registrationid) => {
    // Append status paragraph.
    let statuspara = $("<p></p>").attr("id", "tincanlaunch_status_para");

    // Append completion span.
    let completionspan = $("<span>").attr("id", "tincanlaunch_completioncheck");
    $(SELECTORS.STATUSDIV).append(statuspara, completionspan);

    // Instead of opening in a new tab, navigate in the same tab to the test page.
    window.location.href = 'launch.php?launchform_registration=' + registrationid + '&id=' + id;

    // Since we're navigating in the same tab, monitoring window closure is unnecessary.

    let stringsToRetrieve = [
      {
        key: 'tincanlaunch_progress',
        component: 'tincanlaunch'
      },
      {
        key: 'returntocourse',
        component: 'tincanlaunch'
      },
      {
        key: 'returntoregistrations',
        component: 'tincanlaunch'
      }
    ];

    $(SELECTORS.NEW_ATTEMPT).remove();
    $(SELECTORS.ATTEMPT_TABLE).remove();

    Str.get_strings(stringsToRetrieve)
      .done(function(s) {
        // Display "Attempt in progress".
        $(SELECTORS.STATUSPARA).text(s[0]);

        // Provide a link to return to the course or registrations table.
        let exitpara = $("<p></p>").attr("id", SELECTORS.EXIT);
        if (simplifiedlaunch) {
          exitpara.html("<a href='/course/view.php?id=" + cid + "'>" + s[1] + "</a>");
        } else {
          exitpara.html("<a href='/course/view.php?id=" + cid + "'>" + s[2] + "</a>");
        }

        $(SELECTORS.STATUSPARA).after(exitpara);
    });
};
