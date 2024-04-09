function convertDateFormat(inputDate) {
    // Split the date string into an array containing year, month, and day
    var parts = inputDate.split("/");
    
    // Rearrange the parts into the desired format
    var outputDate = parts[2] + "/" + parts[1] + "/" + parts[0];
    
    return outputDate;
}
export default convertDateFormat;