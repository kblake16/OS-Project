"use strict";

window.onload = function() 
{
    let PhysicalSize = document.getElementById("pps");
    let Offset = document.getElementById("ofb");
    let VM = document.getElementById("vms");
    let TLB = document.getElementById("tlb");
    let Instruction = document.getElementById("Instruction");

    let reset = document.getElementById("reset");
    let submit = document.getElementById("submit");
    let instruct = document.getElementById("submitIn");

    var VMtable = document.getElementById("VirtualMemoryTable");
    var InstructionTable = document.getElementById("InstructionTable");
    var TLBtable = document.getElementById("TLBTable");
    var AddressTable = document.getElementById("AddressTable");
    var Pagetable = document.getElementById("PageTable");
    var PhysicalMemorytable = document.getElementById("PhysicalMemoryTable");
    var currentRow = 1;

    submit.onclick = function createTable() {

        var div = 2 ** parseInt(Offset.value);
        var tlbVal = parseInt(TLB.value);
        var offsetVal = parseInt(Offset.value);
        var vmVal = parseInt(VM.value);
        var physVal = parseInt(PhysicalSize.value);

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


        submit.onclick = null;
        event.preventDefault()

    }

    reset.onclick = function clearTable() {
        console.log("clicked");

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

    }

    instruct.onclick = function updateTable() {
        var valBi = hexToBi(Instruction.value);
        var pageVal = bits(valBi, Offset.value);
        var offsetVal = setBits(valBi,Offset.value);

        console.log("Input: " + Instruction.value);
        console.log("Bi: " + pageVal);
        // Display and calculate Offset and Page bits
        
        var row = InstructionTable.insertRow(InstructionTable.rows.length);
        var cell = row.insertCell(0)
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 =row.insertCell(3);
        cell.innerHTML = Instruction.value;
        cell1.innerHTML = pageVal;
        cell2.innerHTML = offsetVal;

        if (checkTLB(pageVal,offsetVal,cell3) == false)
        {
            checkPageTable(pageVal,offsetVal,cell3);
        }
        

    }

    function checkTLB(p,o,r)
    {
        var check = false;
    
        for (var i = 1; i <= TLB.value; i++) {
            if (TLBtable.rows[i].cells[1].innerHTML == p) 
            {
                AddressTable.rows[1].cells[0].innerHTML = TLBtable.rows[i].cells[2].innerHTML;
                AddressTable.rows[1].cells[1].innerHTML = o;
                r.innerHTML = "TLB HIT";
                check = true;
                break;
            } 
            else if (TLBtable.rows[i].cells[1].innerHTML == "") 
            {
                TLBtable.rows[i].cells[1].innerHTML = p;
                var num = emptyPhys(PhysicalMemorytable);
                TLBtable.rows[i].cells[2].innerHTML = parseInt(PhysicalMemorytable.rows[num].cells[0].innerHTML, 16);
                PhysicalMemorytable.rows[num].cells[1].innerHTML = p + " DATA";
                updatePage(Pagetable, p, PhysicalMemorytable.rows[num].cells[0].innerHTML );
                r.innerHTML = "MISS";
                check = true;
                console.log("TLB miss");
                updateRow();
                break;
            }
            else
            {
                check = false;
            }
        }


        return check;

    }

    function updateRow()
    {
        if (currentRow == TLB.value)
        {
            currentRow = 1;
        }
        else
        {
            currentRow++;
        }
        console.log(currentRow);
    }

    function swap()
    {

    }

    function setPhysAddress(val)
    {

    }

    function checkPageTable(p,o,r)
    {
        var div = 2 ** parseInt(Offset.value);;
        var vmVal = parseInt(VM.value);
        var pageRow = vmVal / div;

        for (var i = 1; i <= pageRow; i++) {
            if (Pagetable.rows[i].cells[0].innerHTML == biToHex(p) && Pagetable.rows[i].cells[1].innerHTML == 1 ) {
                console.log("Found in page table");
                AddressTable.rows[1].cells[0].innerHTML = Pagetable.rows[i].cells[2].innerHTML;
                AddressTable.rows[1].cells[1].innerHTML = o;
                TLBtable.rows[currentRow].cells[1].innerHTML = p;
                TLBtable.rows[currentRow].cells[2].innerHTML = Pagetable.rows[i].cells[2].innerHTML ;
                r.innerHTML = "PAGE HIT";
                console.log("page table hit");
                updateRow()
                break;
            }
            else if (Pagetable.rows[i].cells[0].innerHTML == biToHex(p) && Pagetable.rows[i].cells[1].innerHTML == 0 )
            {
                TLBtable.rows[currentRow].cells[1].innerHTML = p;
                var num = emptyPhys(PhysicalMemorytable);
                TLBtable.rows[currentRow].cells[2].innerHTML = parseInt(PhysicalMemorytable.rows[num].cells[0].innerHTML, 16);
                PhysicalMemorytable.rows[num].cells[1].innerHTML = p + " DATA";
                updatePage(Pagetable, p, PhysicalMemorytable.rows[num].cells[0].innerHTML);
                console.log("page table miss");
                updateRow();
                r.innerHTML = "MISS";
                break;
            }
        }
    }

    function checkPhysMem(p)
    {


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
        var l = num.toString().length
        var n = num.toString().substr(0, l - set);
        l = n.toString().length;
        var input = 9 - l;

        while (input > 0) {
            n = "0" + n;
            input--;
        }

        return n;
    }
    function setBits(num,set)
    {
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
                table.rows[i].cells[1].innerHTML = 1;
                table.rows[i].cells[2].innerHTML = parseInt(index, 16);
                break;
            }
        }
    }
}