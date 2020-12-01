/* Japanese initialisation for the jQuery time picker plugin. */
/* Written by Bernd Plagge (bplagge@choicenet.ne.jp). */
jQuery(function($){
    $.timepicker.regional['ja'] = {
                hourText: '時間',
                minuteText: '分',
                amPmText: ['上午', '下午'],
                closeButtonText: '關閉',
                nowButtonText: '目前',
                deselectButtonText: '選擇解除' }
    $.timepicker.setDefaults($.timepicker.regional['ja']);
});
