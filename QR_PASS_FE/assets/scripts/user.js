import alertPopup from "./utils/alert.js";

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

const API_BASE_URL = 'https://qr-pass-system-prod-be.onrender.com/api';

let originalStudentId = '';

function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

function countRegistrationCookies() {
    const cookies = document.cookie.split(';');
    return cookies.filter(cookie => cookie.trim().startsWith('dlmLqN+l84dx3G759VPBKxBmtWShFJJLmCSffBbSQ14=')).length;
}

function showRegistrationLimitModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Registration Limit Reached</h2>
                <button class="close-modal">&times;</button>
            </div>
            <p>You have reached the maximum number of registrations allowed.</p>
            <div class="modal-actions">
                <button class="primary-btn close-modal">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';

    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.remove();
        });
    });
}

document.getElementById('registerBtn').addEventListener('click', () => {
    const studentId = document.getElementById('studentId').value.trim();
    const name = document.getElementById('studentName').value.trim();
    const course = document.getElementById('registerCourse').value;

    if (countRegistrationCookies() >= 1) {
        showRegistrationLimitModal();
        return;
    }

    if (studentId.length !== 10) {
        alertPopup('Student ID must be exactly 10 characters long');
        return;
    }

    if (!studentId || !name || !course) {
        alertPopup('Please fill in all fields');
        return;
    }

    originalStudentId = studentId;
    
    showVerificationModal();
});

const verificationModal = document.getElementById('verificationModal');
const verifyStudentIdInput = document.getElementById('verifyStudentId');
const confirmVerifyBtn = document.getElementById('confirmVerifyBtn');
const cancelVerifyBtn = document.getElementById('cancelVerifyBtn');
const closeModalBtn = document.querySelector('.close-modal');

function showVerificationModal() {
    verificationModal.style.display = 'flex';
    verifyStudentIdInput.value = '';
    verifyStudentIdInput.focus();
}

function hideVerificationModal() {
    verificationModal.style.display = 'none';
}

closeModalBtn.addEventListener('click', hideVerificationModal);

cancelVerifyBtn.addEventListener('click', hideVerificationModal);

verificationModal.addEventListener('click', (e) => {
    if (e.target === verificationModal) {
        hideVerificationModal();
    }
});

confirmVerifyBtn.addEventListener('click', () => {
    const verifiedStudentId = verifyStudentIdInput.value.trim();
    
    if (!verifiedStudentId) {
        alertPopup('Please enter your Student ID');
        return;
    }
    
    if (verifiedStudentId !== originalStudentId) {
        alertPopup('Student ID does not match. Please try again.');
        verifyStudentIdInput.value = '';
        verifyStudentIdInput.focus();
        return;
    }
    
    hideVerificationModal();
    proceedWithRegistration();
});

async function proceedWithRegistration() {
    const studentId = originalStudentId;
    const name = document.getElementById('studentName').value.trim();
    const course = document.getElementById('registerCourse').value;
    
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.disabled = true;
    registerBtn.textContent = 'Registering...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId,
                name,
                courseName: course
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const cookieName = 'dlmLqN+l84dx3G759VPBKxBmtWShFJJLmCSffBbSQ14=' + Date.now();
            setCookie(cookieName, '1', 48); 
            
            alertPopup('Registration successful!');

            document.getElementById('studentId').value = '';
            document.getElementById('studentName').value = '';
            document.getElementById('registerCourse').value = '';
        } else {
            alertPopup(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alertPopup('Registration failed. Please try again.');
    } finally {
        registerBtn.disabled = false;
        registerBtn.textContent = 'Register Student';
    }
}

document.getElementById('generateQrBtn').addEventListener('click', generateStudentQR);
document.getElementById('downloadBtn').addEventListener('click', downloadQRCode);

async function generateStudentQR() {
    const studentId = document.getElementById('qrStudentId').value.trim();
    const course = document.getElementById('qrCourse').value;
    
    if (studentId.length !== 10) {
        alertPopup('Student ID must be exactly 10 characters long');
        return;
    }

    if (!studentId || !course) {
        alertPopup('Please enter student ID and select year level & section');
        return;
    }
    
    const generateBtn = document.getElementById('generateQrBtn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/generate-qr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId,
                courseName: course
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('qrCodeCanvas').dataset.studentId = studentId;
            document.getElementById('qrCodeCanvas').dataset.studentName = data.studentName || 'student';
            
            const canvas = document.getElementById('qrCodeCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            canvas.width = 300;
            canvas.height = 300;
            
            QRCode.toCanvas(canvas, data.encryptedData, {
                width: 250,
                margin: 2,
                errorCorrectionLevel: 'H'
            }, (error) => {
                if (error) {
                    console.error('QR generation error:', error);
                    alertPopup('Failed to generate QR code');
                } else {
                    document.getElementById('qrCodeContainer').classList.remove('hidden');
                }
            });
        } else {
            alertPopup(data.error || 'Failed to generate QR code');
        }
    } catch (error) {
        console.error('QR generation error:', error);
        alertPopup('Failed to generate QR code. Please try again.');
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate QR Pass';
    }
}

function downloadQRCode() {
    const canvas = document.getElementById('qrCodeCanvas');
    if (!canvas) return;

    const studentId = canvas.dataset.studentId || '';
    const studentName = canvas.dataset.studentName || 'student';
    
    let filename = 'TechKadaPass';
    if (studentId) filename += `_${studentId}`;
    if (studentName) {
        const cleanName = studentName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
        filename += `_${cleanName}`;
    }
    filename += '.png';

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = filename;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
}



async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const data = await response.json();
        
        if (response.ok) {
            return data.courses;
        } else {
            throw new Error(data.error || 'Failed to load courses');
        }
    } catch (error) {
        console.error('Course loading error:', error);
        alertPopup('Failed to load year level & sections. Please try again later.');
        return [];
    }
}

async function populateCourseSelects() {
    const selects = [
        'registerCourse',
        'qrCourse',
    ];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.disabled = true;
            while (select.options.length > 1) {
                select.remove(1);
            }
            select.innerHTML += '<option value="" disabled>Loading year level & sections...</option>';
        }
    });
    
    const courses = await loadCourses();
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            if (select.options.length === 0) {
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = selectId === 'filterCourse' ? 'All Year level and section' : 'Select your year level and section';
                select.appendChild(defaultOption);
            }
            
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.name;
                option.textContent = course.name;
                select.appendChild(option);
            });
            
            select.disabled = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateCourseSelects();
});