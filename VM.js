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
    var check  =  /^[0-9A-Fa-f]+$/;

    instruct.disabled = true;

    submit.onclick = function createTable() {

        if (PhysicalSize.value == "" || Offset.value == "" ||  VM.value == "" || TLB.value == "")
        {
            alert("Please Enter all fields");
        }
        else if ( powerOfTwo(PhysicalSize.value) == false ||  powerOfTwo(VM.value) == false) 
        {
            alert("Please Enter a number that is a power of 2");
        }
        else if (parseInt(Offset.value) >= Math.log2(parseInt(VM.value)))
        {
            alert("Offset is greater than or equal to the allocated bits for the Logical Address");
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
            var next = VMtable.insertRow(2);
            next.insertCell(0);
            next.insertCell(1);
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

        var valBi = hexToBi(Instruction.value);
        var pageVal = pageBits(valBi, Offset.value);

        if(Instruction.value == "")
        {
            alert("Please Enter an Instruction");
        }
        else if (!(check.test(Instruction.value)))
        {
            alert("Please Enter a valid hex");
        }
        else if ( parseInt(pageVal,2) > Pagetable.rows.length - 2 )
        {
            alert("Instruction is larger than page size");
        }
        else
        {
            Pagetable.rows[prevPage].style.backgroundColor = prevPageColor;
            PhysicalMemorytable.rows[prevPhys].style.backgroundColor = prevPhysColor;
            TLBtable.rows[prevTLB].style.backgroundColor = prevTLBColor;

            var offsetVal = offsetBits(valBi, Offset.value);

            textArea.innerHTML = "FIFO Strategy \n";

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
                AddressTable.rows[1].style.backgroundColor = "green";
                VMtable.rows[2].cells[0].innerHTML = TLBtable.rows[i].cells[1].innerHTML;
                VMtable.rows[2].cells[1].innerHTML = o;
                VMtable.rows[2].style.backgroundColor = "green";
                TLBtable.rows[i].style.backgroundColor = "yellow";
                prevTLB= i;
                r.innerHTML = "TLB HIT";
                r.style.color = "green";
                check = true;
                break;
            } else if (TLBtable.rows[i].cells[1].innerHTML == "") {
                prevTLBColor = window.getComputedStyle(TLBTable.rows[i]).backgroundColor;
                TLBtable.rows[i].cells[1].innerHTML = p;
                var num = emptyPhys(PhysicalMemorytable);
                prevPhysColor = window.getComputedStyle(PhysicalMemorytable.rows[num]).backgroundColor;
                TLBtable.rows[i].cells[2].innerHTML = parseInt(PhysicalMemorytable.rows[num].cells[0].innerHTML, 16);
                PhysicalMemorytable.rows[num].cells[1].innerHTML = p + " DATA";
                updatePage(Pagetable, p, PhysicalMemorytable.rows[num].cells[0].innerHTML);
                TLBtable.rows[i].style.backgroundColor = "yellow";
                PhysicalMemorytable.rows[num].style.backgroundColor = "yellow";
                prevPhys = num;
                prevTLB = i;

                AddressTable.rows[1].cells[0].innerHTML = TLBtable.rows[i].cells[2].innerHTML;
                AddressTable.rows[1].cells[1].innerHTML = o;
                AddressTable.rows[1].style.backgroundColor = "red";
                VMtable.rows[2].cells[0].innerHTML = TLBtable.rows[i].cells[1].innerHTML;
                VMtable.rows[2].cells[1].innerHTML = o;
                VMtable.rows[2].style.backgroundColor = "red";

                r.innerHTML = "MISS";
                r.style.color = "red";
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
                prevPageColor = window.getComputedStyle(Pagetable.rows[i]).backgroundColor;
                var num = parseInt(Pagetable.rows[i].cells[2].innerHTML) + 1;
                prevPhysColor = window.getComputedStyle(PhysicalMemorytable.rows[num]).backgroundColor;
                PhysicalMemorytable.rows[num].style.backgroundColor = "yellow";
                prevPhys = num;

                AddressTable.rows[1].cells[0].innerHTML = Pagetable.rows[i].cells[2].innerHTML;
                AddressTable.rows[1].cells[1].innerHTML = o;
                AddressTable.rows[1].style.backgroundColor = "green";
                VMtable.rows[2].cells[0].innerHTML = p;
                VMtable.rows[2].cells[1].innerHTML = o;
                VMtable.rows[2].style.backgroundColor = "green";

                //text area display
                textArea.innerHTML += "\n Index: " + TLBtable.rows[currentRow].cells[0].innerHTML
                +"\n \n Old Entry \n Virtual Page: " + TLBtable.rows[currentRow].cells[1].innerHTML 
                + "\n Phyical Page " + TLBtable.rows[currentRow].cells[2].innerHTML
                + "\n \n  New Entry \n Virtual Page: " + p
                + "\n Phyiscal Page: " +  Pagetable.rows[i].cells[2].innerHTML;

                TLBtable.rows[currentRow].cells[1].innerHTML = p;
                TLBtable.rows[currentRow].cells[2].innerHTML = Pagetable.rows[i].cells[2].innerHTML;
                TLBtable.rows[currentRow].style.backgroundColor = "yellow";
                prevTLB= currentRow;
                Pagetable.rows[i].style.backgroundColor = "yellow";
                prevPage = i;
                r.innerHTML = "PAGE HIT";
                r.style.color = "green";
                updateRow()
                break;
            } else if (Pagetable.rows[i].cells[0].innerHTML == biToHex(p) && Pagetable.rows[i].cells[1].innerHTML == 0) {
                prevTLBColor = window.getComputedStyle(TLBTable.rows[currentRow]).backgroundColor;

                //text area display
                textArea.innerHTML += "\n Index: " + TLBtable.rows[currentRow].cells[0].innerHTML
                +"\n \n Old Entry \n Virtual Page: " + TLBtable.rows[currentRow].cells[1].innerHTML 
                + "\n Phyical Page " + TLBtable.rows[currentRow].cells[2].innerHTML
                + "\n \n  New Entry \n Virtual Page: " + p;

                TLBtable.rows[currentRow].cells[1].innerHTML = p;
                var num = emptyPhys(PhysicalMemorytable);
                prevPhysColor = window.getComputedStyle(PhysicalMemorytable.rows[num]).backgroundColor;
                TLBtable.rows[currentRow].cells[2].innerHTML = parseInt(PhysicalMemorytable.rows[num].cells[0].innerHTML, 16);

                textArea.innerHTML += "\n Phyiscal Page: " +  TLBtable.rows[currentRow].cells[2].innerHTML;

                PhysicalMemorytable.rows[num].cells[1].innerHTML = p + " DATA";
                updatePage(Pagetable, p, PhysicalMemorytable.rows[num].cells[0].innerHTML);

                AddressTable.rows[1].cells[0].innerHTML = Pagetable.rows[i].cells[2].innerHTML;
                AddressTable.rows[1].cells[1].innerHTML = o;
                AddressTable.rows[1].style.backgroundColor = "red";
                VMtable.rows[2].cells[0].innerHTML = p;
                VMtable.rows[2].cells[1].innerHTML = o;
                VMtable.rows[2].style.backgroundColor = "red";

                PhysicalMemorytable.rows[num].style.backgroundColor = "yellow";
                prevPhys = num;
                TLBtable.rows[currentRow].style.backgroundColor = "yellow";
                prevTLB= currentRow;
                updateRow();
                r.innerHTML = "MISS";
                r.style.color = "red";
                break;
            }
        }
    }


    function powerOfTwo(num)
    {
        var power = false;
        if (num && (num & (num - 1)) === 0)
        {
            power =true;
        }
        return power
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

    function pageBits(num, set) {
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

    function offsetBits(num, set) {
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
                table.rows[i].style.backgroundColor = "yellow";
                prevPage = i;
                break;
            }
        }
    }
}