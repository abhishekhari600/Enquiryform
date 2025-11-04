document.addEventListener('DOMContentLoaded', () => {
  const enquiryForm = document.getElementById('enquiryForm');

  if (!enquiryForm) {
    console.error('⚠️ enquiryForm not found in DOM');
    return;
  }

  enquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      full_name: document.getElementById('fullName')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      email: document.getElementById('enquiryEmail')?.value || '',
      batch_timings: document.getElementById('BATCH_TIMINGS')?.value || '',
      course: document.getElementById('course')?.value || '',
      education: document.getElementById('education')?.value || '',
      passed_out_year: document.getElementById('passedOutYear')?.value || ''
    };

    try {
      const res = await fetch('/api/enquiry_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });


      const result = await res.json();
      if (res.ok) {
        showPopup(); // 👈 Show the popup instead of alert
    /*    setTimeout(() => {
          window.location.href = 'enquiryform.html';
        }, 3000);*/ // Redirect after 3 seconds
      } else {
        alert(`❌ Error: ${result.message || 'Submission failed'}`);
      }
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      alert('❌ Network error.');
    }
  });
  function showPopup() {
    document.getElementById('successPopup').style.display = 'flex';
  }

  function closePopup() {
    document.getElementById('successPopup').style.display = 'none';
    window.location.href = 'enquiry-dashboard.html';
  }

});
