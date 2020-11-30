"use strict";


window.onload = function() {
    // Get form input by ID
    let PhysicalSize = document.getElementById("pps");
    let Offset = document.getElementById("ofb");
    let VM = document.getElementById("vms");
    let TLB = document.getElementById("tlb");
    let Instruction = document.getElementById("Instruction");
    //Get button by ID
    let reset = document.getElementById("reset");
    let submit = document.getElementById("submit");
    let instruct = document.getElementById("submitIn");
    //Get Table by ID
    var VMtable = document.getElementById("VirtualMemoryTable");
    var InstructionTable = document.getElementById("InstructionTable");
    var TLBtable = document.getElementById("TLBTable");
    var AddressTable = document.getElementById("AddressTable");
    var Pagetable = document.getElementById("PageTable");
    var PhysicalMemorytable = document.getElementById("PhysicalMemoryTable");

    var textArea = document.getElementById("area");

    var currentRow = 1;
    var prevTLB = 0;
    var prevTLBColor = "";
    var prevPage = 0;
    var prevPageColor = "";
    var prevPhys = 0;
    var prevPhysColor = "";

    instruct.disabled = true;

    submit.onclick = function createTable() {

        if (PhysicalSize.value == "" || Offset.value == "" ||  VM.value == "" || TLB.value == "")
        {
            alert("Please Enter all fields");
        }
        else
        {
            //Calculates

            var div = 2 ** parseInt(Offset.value);
            //Convert the values from the form to Int
            var tlbVal = parseInt(TLB.value);
            var offsetVal = parseInt(Offset.value);
            var vmVal = parseInt(VM.value);
            var physVal = parseInt(PhysicalSize.value);

            //Address Table
            var a = AddressTable.insertRow(1);
            a.insertCell(0);
            a.insertCell(1);

            // Display and calculate Offset and Page bits
            var InstructionLength = Math.log2(vmVal);
            var row = VMtable.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = InstructionLength - offsetVal + " bits";
            cell2.innerHTML = offsetVal + " bits";

            //TLB table
            var rowNum = 1;
            for (var i = 0; i < tlbVal; i++) {
                var row = TLBtable.insertRow(rowNum);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2)
                cell1.innerHTML = i;
                rowNum++;
            }

            //Page table
            var rowNum = 1;
            var pageRow = vmVal / div;
            for (var i = 0; i < pageRow; i++) {
                var row = Pagetable.insertRow(rowNum);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                row.insertCell(2);

                cell1.innerHTML = toHex(i);
                cell2.innerHTML = 0;

                rowNum++;
            }
            //Physical page
            var rowNum = 1;
            var physRow = physVal / div;
            for (var i = 0; i < physRow; i++) {
                var row = PhysicalMemorytable.insertRow(rowNum);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);

                cell1.innerHTML = toHex(i);
                rowNum++;
            }
            submit.disabled = true;
            instruct.disabled = false;
            event.preventDefault();
        }
    }

    reset.onclick = function clearTable() {
        
        // clear TBL table
        var rowCount = TLBtable.rows.length - 1;
        for (var i = rowCount; i > 0; i--) {
            TLBtable.deleteRow(i);
        }

        // clear VM table
        var rowCount = VMtable.rows.length - 1;
        for (var i = rowCount; i > 0; i--) {
            VMtable.deleteRow(i);
        }

        // clear Page table
        var rowCount = Pagetable.rows.length - 1;
        for (var i = rowCount; i > 0; i--) {
            Pagetable.deleteRow(i);
        }
        //clear PhysicalMemorytable
        var rowCount = PhysicalMemorytable.rows.length - 1;
        for (var i = rowCount; i > 0; i--) {
            PhysicalMemorytable.deleteRow(i);
        }
        //clear AddressTable
        var rowCount = AddressTable.rows.length - 1;
        for (var i = rowCount; i > 0; i--) {
            AddressTable.deleteRow(i);
        }
        // clear InstructionTbale
        var rowCount = Instruction.rows.length - 1;
        for (var i = rowCount; i > 0; i--) {
            Instruction.deleteRow(i);
        }
        submit.disabled = false;
        instruct.disabled = true;
        event.preventDefault();
    }

    instruct.onclick = function updateTable() {

        Pagetable.rows[prevPage].style.backgroundColor = prevPageColor;
        //PhysicalMemorytable.rows[prevPhys].style.backgroundColor = prevPhysColor;
        TLBtable.rows[prevTLB].style.backgroundColor = prevTLBColor;

        var valBi = hexToBi(Instruction.value);
        var pageVal = bits(valBi, Offset.value);


        console.log(parseInt(pageVal,2));
        console.log(Pagetable.rows.length - 2);

        if(Instruction.value == "")
        {
            alert("Please Enter an Instruction");
        }
        else if ( parseInt(pageVal,2) > Pagetable.rows.length - 2 )
        {
            alert("Instruction is larger than page size");
        }
        else
        {
            var offsetVal = setBits(valBi, Offset.value);

            textArea.innerHTML = "Page Replacement Strategy";

            console.log("Input: " + Instruction.value);
            console.log("Bi: " + pageVal);
            // Display and calculate Offset and Page bits

            var row = InstructionTable.insertRow(InstructionTable.rows.length);
            var cell = row.insertCell(0)
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            cell.innerHTML = Instruction.value;
            cell1.innerHTML = pageVal;
            cell2.innerHTML = offsetVal;

            if (checkTLB(pageVal, offsetVal, cell3) == false) {
                checkPageTable(pageVal, offsetVal, cell3);
            }
        }

    }

    function checkTLB(p, o, r) {
        var check = false;

        for (var i = 1; i <= TLB.value; i++) {
            if (TLBtable.rows[i].cells[1].innerHTML == p) {
                prevTLBColor = window.getComputedStyle(TLBTable.rows[i]).backgroundColor;
                AddressTable.rows[1].cells[0].innerHTML = TLBtable.rows[i].cells[2].innerHTML;
                AddressTable.rows[1].cells[1].innerHTML = o;
                TLBtable.rows[i].style.backgroundColor = "green";
                prevTLB= i;
                r.innerHTML = "TLB HIT";
                check = true;
                break;
            } else if (TLBtable.rows[i].cells[1].innerHTML == "") {
                prevTLBColor = window.getComputedStyle(TLBTable.rows[i]).backgroundColor;
                TLBtable.rows[i].cells[1].innerHTML = p;
                var num = emptyPhys(PhysicalMemorytable);
                TLBtable.rows[i].cells[2].innerHTML = parseInt(PhysicalMemorytable.rows[num].cells[0].innerHTML, 16);
                PhysicalMemorytable.rows[num].cells[1].innerHTML = p + " DATA";
                updatePage(Pagetable, p, PhysicalMemorytable.rows[num].cells[0].innerHTML);
                TLBtable.rows[i].style.backgroundColor = "green";
                prevTLB = i;
                r.innerHTML = "MISS";
                check = true;
                console.log("TLB miss");
                updateRow();
                break;
            } else {
                check = false;
            }
        }


        return check;

    }

    function updateRow() {
        if (currentRow == TLB.value) {
            currentRow = 1;
        } else {
            currentRow++;
        }
        console.log(currentRow);
    }

    function checkPageTable(p, o, r) {
        var div = 2 ** parseInt(Offset.value);;
        var vmVal = parseInt(VM.value);
        var pageRow = vmVal / div;

        for (var i = 1; i <= pageRow; i++) {
            if (Pagetable.rows[i].cells[0].innerHTML == biToHex(p) && Pagetable.rows[i].cells[1].innerHTML == 1) {
                prevTLBColor = window.getComputedStyle(TLBTable.rows[currentRow]).backgroundColor;
                console.log("Found in page table");
                AddressTable.rows[1].cells[0].innerHTML = Pagetable.rows[i].cells[2].innerHTML;
                AddressTable.rows[1].cells[1].innerHTML = o;
                TLBtable.rows[currentRow].cells[1].innerHTML = p;
                TLBtable.rows[currentRow].cells[2].innerHTML = Pagetable.rows[i].cells[2].innerHTML;
                TLBtable.rows[currentRow].style.backgroundColor = "green";
                prevTLB= currentRow;
                r.innerHTML = "PAGE HIT";
                updateRow()
                break;
            } else if (Pagetable.rows[i].cells[0].innerHTML == biToHex(p) && Pagetable.rows[i].cells[1].innerHTML == 0) {
                prevTLBColor = window.getComputedStyle(TLBTable.rows[currentRow]).backgroundColor;
                TLBtable.rows[currentRow].cells[1].innerHTML = p;
                var num = emptyPhys(PhysicalMemorytable);
                TLBtable.rows[currentRow].cells[2].innerHTML = parseInt(PhysicalMemorytable.rows[num].cells[0].innerHTML, 16);
                PhysicalMemorytable.rows[num].cells[1].innerHTML = p + " DATA";
                updatePage(Pagetable, p, PhysicalMemorytable.rows[num].cells[0].innerHTML);
                TLBtable.rows[currentRow].style.backgroundColor = "green";
                prevTLB= currentRow;
                updateRow();
                r.innerHTML = "MISS";
                break;
            }
        }
    }

    function toHex(num) {
        return num.toString(16);
    }

    function toBi(num) {
        return num.toString(2);
    }

    function hexToBi(num) {
        return parseInt(num, 16).toString(2);
    }

    function biToHex(num) {
        return parseInt(num, 2).toString(16);
    }

    function bits(num, set) {
        var val = Math.log2(VM.value) - Offset.value
        var l = num.toString().length
        var n = num.toString().substr(0, l - set);
        l = n.toString().length;
        var input = val - l;

        while (input > 0) {
            n = "0" + n;
            input--;
        }

        return n;
    }

    function setBits(num, set) {
        var n = num.toString().substr(-set);
        return n;
    }

    function emptyPhys(table) {
        var len = table.rows.length;

        for (var i = 1; i < len; i++) {
            if (table.rows[i].cells[1].innerHTML == "") {
                return i;
            }
        }
    }

    function updatePage(table, val, index) {
        var len = table.rows.length;

        for (var i = 1; i < len; i++) {
            if (table.rows[i].cells[0].innerHTML == biToHex(val)) {
                prevPageColor = window.getComputedStyle(table.rows[i]).backgroundColor;
                table.rows[i].cells[1].innerHTML = 1;
                table.rows[i].cells[2].innerHTML = parseInt(index, 16);
                table.rows[i].style.backgroundColor = "green";
                prevPage = i;
                break;
            }
        }
    }
}