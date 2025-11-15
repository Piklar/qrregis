import alertPopup from "./utils/alert.js";

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// const API_BASE_URL = 'http://localhost:4000/api';
const API_BASE_URL = 'https://qrregis.onrender.com/api';

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
            setCookie(cookieName, '1', 999); 
            
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
            
            // Set larger canvas size for elegant layout
            canvas.width = 450;
            canvas.height = 650;
            
            // Draw old money themed background (cream with subtle texture)
            ctx.fillStyle = '#F5F0E6';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add subtle texture
            ctx.fillStyle = 'rgba(210, 190, 150, 0.05)';
            for (let i = 0; i < 100; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    Math.random() * 3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
            
            // Draw elegant border
            ctx.strokeStyle = '#8B6B3D';
            ctx.lineWidth = 8;
            ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
            
            // Draw "IT-Night" at the top with elegant font
            const elegantFont = 'italic 36px "Playfair Display", "Palatino Linotype", "Book Antiqua", "Times New Roman", serif';
            ctx.fillStyle = '#5C4A2A';
            ctx.font = elegantFont;
            ctx.textAlign = 'center';
            // Draw the text with a slight shadow for depth
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText('𝐈𝐍𝐍𝐎𝐕𝐀𝐈𝐓 𝟐𝟎𝟐𝟓', canvas.width/2, 70);
            ctx.shadowColor = 'transparent';
            
            // Add decorative line under title
            ctx.strokeStyle = '#8B6B3D';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(canvas.width/2 - 100, 85);
            ctx.lineTo(canvas.width/2 + 100, 85);
            ctx.stroke();
            
            // Generate QR code in the middle
            const qrSize = 280;
            const qrX = (canvas.width - qrSize) / 2;
            const qrY = 120;
            
            // Create a temporary canvas for QR code
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = qrSize;
            tempCanvas.height = qrSize;
            
            await new Promise((resolve, reject) => {
                QRCode.toCanvas(tempCanvas, data.encryptedData, {
                    width: qrSize,
                    margin: 2,
                    errorCorrectionLevel: 'H',
                    color: {
                        dark: '#5C4A2A', // Dark brown for QR code
                        light: '#F5F0E600' // Transparent background
                    }
                }, (error) => {
                    if (error) {
                        reject(error);
                        console.error('QR generation error:', error);
                        alertPopup('Failed to generate QR code');
                    } else {
                        resolve();
                    }
                });
            });
            
            // Draw QR code onto main canvas with shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 5;
            ctx.drawImage(tempCanvas, qrX, qrY);
            ctx.shadowColor = 'transparent';
            
            // Draw elegant invitation text at the bottom
            ctx.fillStyle = '#5C4A2A';
            ctx.font = 'italic 22px "Times New Roman", serif';
            ctx.fillText('You are cordially invited to', canvas.width/2, qrY + qrSize + 50);
            
            ctx.font = 'bold 22px "Times New Roman", serif';
            ctx.fillText('Transforming Visions into Innovations!', canvas.width/2, qrY + qrSize + 85);
            
            ctx.font = '18px "Times New Roman", serif';
            ctx.fillText('Present this QR code for entry', canvas.width/2, qrY + qrSize + 120);
            
            // Add small decorative elements
            ctx.fillStyle = '#8B6B3D';
            ctx.font = '14px "Times New Roman", serif';
            ctx.fillText(studentId, canvas.width/2, qrY + qrSize + 150);
            
            document.getElementById('qrCodeContainer').classList.remove('hidden');
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
    
    let filename = 'INNOVAIT_2025_Pass';
    if (studentId) filename += `_${studentId}`;
    if (studentName) {
        const cleanName = studentName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
        filename += `_${cleanName}`;
    }
    filename += '.png';

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
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
            select.innerHTML += '<option value="" disabled>Choose your Year level & Section</option>';
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