// api/contact.js

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('RESEND_API_KEY is not defined in environment variables.');
            return res.status(500).json({ error: 'Server configuration error (missing API key)' });
        }

        const data = req.body;
        if (!data || !data.name || !data.email) {
            return res.status(400).json({ error: 'Name and Email are required fields.' });
        }

        const formType = data.type || 'contact'; // 'contact' or 'booking'
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        const toEmail = process.env.RESEND_TO_EMAIL || "collab@bmdesign01.com";

        // Build email subject and HTML content
        let subject = '';
        let htmlContent = '';

        if (formType === 'booking') {
            subject = `[Rezervacija] Novi upit za: ${data.service || 'Kolekciju/Stil'}`;
            
            const stylesList = Array.isArray(data.styles) 
                ? data.styles.join(', ') 
                : (data.styles || 'Nema odabranih stilova');

            htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fcfcfc;">
                    <h2 style="color: #111; border-bottom: 2px solid #d7d2c8; padding-bottom: 10px; margin-bottom: 20px;">Novi Upit za Rezervaciju</h2>
                    
                    <p>Primljen je novi upit za rezervaciju sa veb-sajta BM Design01.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr style="background-color: #f7f7f7;">
                            <td style="padding: 10px; font-weight: bold; width: 30%; border: 1px solid #eee;">Odabrana usluga:</td>
                            <td style="padding: 10px; border: 1px solid #eee; color: #d97706; font-weight: bold;">${data.service || 'Nije specificirano'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Ime klijenta:</td>
                            <td style="padding: 10px; border: 1px solid #eee;">${data.name}</td>
                        </tr>
                        <tr style="background-color: #f7f7f7;">
                            <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Email:</td>
                            <td style="padding: 10px; border: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Naziv brenda:</td>
                            <td style="padding: 10px; border: 1px solid #eee;">${data.brand || 'Nije navedeno'}</td>
                        </tr>
                        <tr style="background-color: #f7f7f7;">
                            <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Instagram / Sajt:</td>
                            <td style="padding: 10px; border: 1px solid #eee;">${data.social || 'Nije navedeno'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Odabrani stilovi:</td>
                            <td style="padding: 10px; border: 1px solid #eee;">${stylesList}</td>
                        </tr>
                    </table>
                    
                    <h3 style="margin-top: 30px; color: #333;">Napomene i ciljevi projekta:</h3>
                    <div style="background-color: #fff; padding: 15px; border: 1px solid #eee; border-radius: 4px; white-space: pre-wrap; font-style: italic; color: #555;">
                        ${data.details || 'Nema napomena.'}
                    </div>
                    
                    <footer style="margin-top: 30px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
                        BM Design01 · Automatsko obaveštenje
                    </footer>
                </div>
            `;
        } else {
            // Default is contact form
            subject = `[Kontakt] Nova poruka od: ${data.name}`;
            
            htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fcfcfc;">
                    <h2 style="color: #111; border-bottom: 2px solid #d7d2c8; padding-bottom: 10px; margin-bottom: 20px;">Nova Poruka sa Kontakt Forme</h2>
                    
                    <p>Primljena je nova poruka sa kontakt forme BM Design01.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <td style="padding: 10px; font-weight: bold; width: 30%; border: 1px solid #eee;">Ime pošiljaoca:</td>
                            <td style="padding: 10px; border: 1px solid #eee;">${data.name}</td>
                        </tr>
                        <tr style="background-color: #f7f7f7;">
                            <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Email:</td>
                            <td style="padding: 10px; border: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Brend:</td>
                            <td style="padding: 10px; border: 1px solid #eee;">${data.brand || 'Nije navedeno'}</td>
                        </tr>
                        <tr style="background-color: #f7f7f7;">
                            <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Instagram / Sajt:</td>
                            <td style="padding: 10px; border: 1px solid #eee;">${data.social || 'Nije navedeno'}</td>
                        </tr>
                    </table>
                    
                    <h3 style="margin-top: 30px; color: #333;">Detalji projekta / Poruka:</h3>
                    <div style="background-color: #fff; padding: 15px; border: 1px solid #eee; border-radius: 4px; white-space: pre-wrap; color: #333;">
                        ${data.details || 'Nema detalja.'}
                    </div>
                    
                    <footer style="margin-top: 30px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
                        BM Design01 · Automatsko obaveštenje
                    </footer>
                </div>
            `;
        }

        // Send to Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromEmail,
                to: toEmail,
                subject: subject,
                html: htmlContent,
                reply_to: data.email
            })
        });

        // Some error handling logic for response content
        let responseData;
        const textContent = await response.text();
        try {
            responseData = JSON.parse(textContent);
        } catch (e) {
            responseData = { message: textContent };
        }

        if (response.ok) {
            return res.status(200).json({ success: true, message: 'Email sent successfully', id: responseData.id });
        } else {
            console.error('Resend API error response:', responseData);
            return res.status(response.status).json({ 
                error: 'Failed to send email via Resend', 
                details: responseData.message || responseData 
            });
        }

    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({ 
            error: 'Internal Server Error', 
            message: error.message,
            stack: error.stack,
            errorName: error.name
        });
    }
};
