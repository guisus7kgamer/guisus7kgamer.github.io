function checkForm(){
    var i, j;
    var hasFormError;
    for(i = 0; i < _check.length; i++){
      var hasError = false;
      for(j = 0; j < _check[i].errs.length; j++){
        if(_err[_check[i].errs[j].code]){
          _check[i].msgEle.innerHTML = _check[i].errs[j].msg;
          hasError = true;
        }
      }
      if(_check[i].defaultMsg){
        _check[i].desEle.className = 'des';
        _check[i].msgEle.className = hasError ? 'error': 'msg';
        if(!hasError){
          _check[i].msgEle.innerHTML = _check[i].defaultMsg;
        }
      }else{
        _check[i].desEle.className = hasError ? 'des': 'hide';
      }
      if (hasError) {
        hasFormError = true;
      }
    }
  
    return hasFormError;
  }
  
  function validateOmletId(omid){
    var idPt = /^[A-Z0-9][A-Z0-9._]{5,19}$/i;
    var idPt2 = /^[0-9]{6,20}$/i;
  
    if(!omid){
      _err['ioi'] = true;
      return false;
    }else{
      if(!idPt.test(omid) || idPt2.test(omid)){
        _err['ioi'] = true;
        return false;
      }
    }
    return true;
  }
  
  function validateEmail(email){
    var emailPt = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  
    if(!email){
      _err['ie'] = true;
      return false;
    }else{
      if(!emailPt.test(email)){
        _err['ie'] = true;
        return false;
      }
    }
  
    return true;
  }
  
  function validateGender(gender) {
    if(!gender){
      _err['ig'] = true;
      return false;
    } else {
      if (gender !== 'Female' && gender !== 'Male' && gender !== 'Unknown') {
        _err['ig'] = true;
        return false;
      }
    }
    return true;
  }
  
  function validateBirthday(birthday) {
    if(!birthday){
      _err['ib'] = true;
      return false;
    } else {
      var date = new Date(birthday)
     //TODO: validate birthday
    }
    return true;
  }
  
  function validateOmletIdEmail(omid){
    if(!omid){
      _err['ioi'] = true;
      return false;
    }else{
      if(omid.indexOf('@') === -1){
        return validateOmletId(omid);
      }else{
        return validateEmail(omid);
      }
    }
  }
  
  function validatePassword(pass, omid){
    if(!pass){
      _err['ip'] = true;
      return false;
    } else {
      if (!/[0-9]/.test(pass)) {
          _err['ip2'] = true;
          return false;
      } else if (!/[a-zA-Z]/.test(pass)) {
          _err['ip3'] = true;
          return false;
      } else if (/[ ]/.test(pass)) {
          _err['ip4'] = true;
          return false;
      } else if (pass.includes(omid)) {
          _err['ip5'] = true;
          return false;
      } else {
          var passPt = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{8,20}$/i;
          if(!passPt.test(pass)){
            _err['ip'] = true;
            return false;
          }
      }
    }
    return true;
  }
  
  function validatePassword2(pass, cpass){
    var valid = true;
    valid = validatePassword(pass) && valid;
  
    if(pass === cpass){
      valid = true && valid;
    } else {
      _err['pnm'] = true;
      valid = false && valid;
    }
    return valid;
  }
  
  function getLoginErrorCount() {
    const count = sessionStorage.getItem('gLoginErrorCount');
    return parseInt(count) || 0;
  }
  
  function addLoginErrorCount() {
    let count = getLoginErrorCount() + 1;
    sessionStorage.setItem('gLoginErrorCount', count);
  }
  
  function resetLoginErrorCount() {
    sessionStorage.setItem('gLoginErrorCount', 0);
  }
  
  function validateLogin(){
    var f = document.forms["signin"];
    f['omid'].value = f['omid'].value.trim();
    var omid = f['omid'].value;
    var pass = f['pass'].value;
    _err = {};
  
    var valid = true;
    valid = validateOmletIdEmail(omid) && valid;
  
    if (!valid) {
      checkErrorCountAlert();
      return false;
    }
  
    return valid;
  }
  
  function checkErrorCountAlert() {
    const hasLoginError = checkForm();
    if (hasLoginError) {
      addLoginErrorCount();
    }
  
    const errorCount = getLoginErrorCount();
    if (errorCount > 2) {
      const modal = document.getElementById('reset-confirm');
      if (modal) {
        modal.classList.add('show');
        resetLoginErrorCount();
      }
    }
  }
  
  function validateRegister(){
    var f = document.forms["signin"];
    _err = {};
    var valid = true;
  
    if(f['omid']){
      var omid = f['omid'].value;
      valid = validateOmletId(omid) && valid;
    }
  
    if(f['pass']){
      var pass = f['pass'].value;
      valid = validatePassword(pass, f['omid'].value) && valid;
    }
  
    if(f['email']){
      var email = f['email'].value.trim();
      f['email'].value = email;
      valid = validateEmail(email) && valid;
    }
  
    if(f['gender']){
      var gender = f['gender'].value.trim();
      valid = validateGender(gender) && valid;
    }
  
    if(f['birthday-picker']){
      var birthday = f['birthday-picker'].value.trim();
      valid = validateBirthday(birthday) && valid;
      if (valid) {
          //TODO: handle timezone
          f['birthday'].value = new Date(birthday).getTime().toString();
      } else {
          f['birthday'].value = "0";
      }
    }
  
    checkForm();
    if(valid){
      showLoader();
    } else {
    }
    return valid;
  }
  
  function validateForgotPassword(){
    var f = document.forms["signin"];
    f['omid'].value = f['omid'].value.trim();
    var omid = f['omid'].value;
    _err = {};
  
    const valid = validateEmail(omid);
  
    checkForm();
    if(valid){
      showLoader();
    }
    return valid;
  }
  
  function validateResetPassword(){
    var f = document.forms["signin"];
    var pass = f['pass'].value;
    var cpass = f['cpass'].value;
    _err = {};
  
    var valid = true;
    valid = validatePassword2(pass, cpass) && valid;
  
    checkForm();
    return valid;
  }
  
  function validateSetOmletId(){
    var f = document.forms["signin"];
    f['omid'].value = f['omid'].value.trim();
    var omid = f['omid'].value;
    _err = {};
  
    var valid = true;
    valid = validateOmletId(omid) && valid;
  
    checkForm();
    return valid;
  }
  
  function togglePasswordVisibility() {
    const input = document.getElementById('pass');
    const btn = document.getElementById('pw-visible-btn');
    if (input.type === 'password') {
      input.type= 'text';
      btn.classList.add("hide-pw");
    } else {
      input.type = 'password';
      btn.classList.remove("hide-pw");
    }
  }
  
  function toggleCPasswordVisibility() {
    const input = document.getElementById('cpass');
    const btn = document.getElementById('cpw-visible-btn');
    if (input.type === 'password') {
      input.type= 'text';
      btn.classList.add("hide-pw");
    } else {
      input.type = 'password';
      btn.classList.remove("hide-pw");
    }
  }
  
  // note: android client calls closeErrorCountAlert from app, don't change function name
  function closeErrorCountAlert() {
    const modal = document.getElementById('reset-confirm');
    if (modal) {
      modal.classList.remove('show');
      resetLoginErrorCount();
    }
  }
  
  function showLoader() {
    const modal = document.getElementById('loader');
    if (modal) {
      modal.classList.add('show');
    }
  }
  
  function hideLoader() {
    const modal = document.getElementById('loader');
    if (modal) {
      modal.classList.remove('show');
    }
  }