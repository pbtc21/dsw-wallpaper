import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// Elegant HTML template
const layout = (content: string, title = 'Daniel Schneider-Weiler | Hand Painted Wallpaper') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --ivory: #FDFBF7;
      --cream: #F7F4ED;
      --taupe: #8B8178;
      --charcoal: #2C2C2C;
      --gold: #C4A77D;
      --sage: #9CAF88;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Montserrat', sans-serif;
      font-weight: 300;
      background: var(--ivory);
      color: var(--charcoal);
      line-height: 1.8;
      letter-spacing: 0.02em;
    }

    h1, h2, h3, h4 {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 300;
      letter-spacing: 0.05em;
    }

    nav {
      position: fixed;
      top: 0;
      width: 100%;
      padding: 2rem 4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(253, 251, 247, 0.95);
      backdrop-filter: blur(10px);
      z-index: 100;
      border-bottom: 1px solid rgba(139, 129, 120, 0.1);
    }

    .logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.4rem;
      font-weight: 400;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--charcoal);
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 3rem;
    }

    .nav-links a {
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--taupe);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .nav-links a:hover {
      color: var(--charcoal);
    }

    .hero {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: linear-gradient(135deg, var(--cream) 0%, var(--ivory) 100%);
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q35 15 30 25 Q25 15 30 5' fill='none' stroke='%239CAF88' stroke-width='0.5' opacity='0.15'/%3E%3Cpath d='M15 30 Q25 35 35 30 Q25 25 15 30' fill='none' stroke='%239CAF88' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E");
      opacity: 0.5;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      padding: 2rem;
    }

    .hero h1 {
      font-size: 4rem;
      font-weight: 300;
      margin-bottom: 1.5rem;
      color: var(--charcoal);
    }

    .hero .tagline {
      font-size: 1rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--taupe);
      margin-bottom: 3rem;
    }

    .btn {
      display: inline-block;
      padding: 1rem 3rem;
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      text-decoration: none;
      border: 1px solid var(--charcoal);
      color: var(--charcoal);
      background: transparent;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn:hover {
      background: var(--charcoal);
      color: var(--ivory);
    }

    section {
      padding: 8rem 4rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-title {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      text-align: center;
      color: var(--taupe);
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 4rem;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .gallery-item {
      aspect-ratio: 3/4;
      background: var(--cream);
      position: relative;
      overflow: hidden;
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .gallery-item:hover img {
      transform: scale(1.05);
    }

    .about-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      align-items: center;
    }

    .about-image {
      aspect-ratio: 4/5;
      background: var(--cream);
      overflow: hidden;
    }

    .about-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
    }

    .about-content h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }

    .about-content p {
      margin-bottom: 1.5rem;
      color: var(--taupe);
    }

    .booking-section {
      background: var(--cream);
      padding: 8rem 4rem;
    }

    .booking-form {
      max-width: 600px;
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    .form-group label {
      display: block;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--taupe);
      margin-bottom: 0.75rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 1rem;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.9rem;
      border: 1px solid rgba(139, 129, 120, 0.3);
      background: var(--ivory);
      color: var(--charcoal);
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--gold);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    footer {
      text-align: center;
      padding: 4rem;
      background: var(--charcoal);
      color: var(--cream);
    }

    footer .logo {
      color: var(--cream);
      margin-bottom: 1.5rem;
      display: block;
    }

    footer p {
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      opacity: 0.7;
    }

    .success-message {
      background: var(--sage);
      color: white;
      padding: 1rem 2rem;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      nav {
        padding: 1.5rem 2rem;
      }

      .nav-links {
        display: none;
      }

      .hero h1 {
        font-size: 2.5rem;
      }

      section {
        padding: 4rem 2rem;
      }

      .gallery {
        grid-template-columns: 1fr;
      }

      .about-section {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
`;

// Home page
app.get('/', (c) => {
  const html = layout(`
    <nav>
      <a href="/" class="logo">DSW</a>
      <div class="nav-links">
        <a href="#portfolio">Portfolio</a>
        <a href="#about">About</a>
        <a href="#book">Book Consultation</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-content">
        <h1>Hand Painted Wallpaper</h1>
        <p class="tagline">Bespoke artistry for distinguished interiors</p>
        <a href="#book" class="btn">Schedule a Consultation</a>
      </div>
    </section>

    <section id="portfolio">
      <h2 class="section-title">Portfolio</h2>
      <p class="section-subtitle">Selected Works</p>
      <div class="gallery">
        <div class="gallery-item" style="background: linear-gradient(135deg, #E8E4DD 0%, #D4CFC4 100%);">
          <div style="height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <span style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--taupe);">Chinoiserie</span>
            <span style="font-size: 0.7rem; color: var(--taupe); margin-top: 0.5rem; letter-spacing: 0.1em;">Hand painted silk</span>
          </div>
        </div>
        <div class="gallery-item" style="background: linear-gradient(135deg, #E5E8E4 0%, #CED4C8 100%);">
          <div style="height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <span style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--taupe);">Botanicals</span>
            <span style="font-size: 0.7rem; color: var(--taupe); margin-top: 0.5rem; letter-spacing: 0.1em;">Watercolor on paper</span>
          </div>
        </div>
        <div class="gallery-item" style="background: linear-gradient(135deg, #E8E6E4 0%, #D4D0CC 100%);">
          <div style="height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <span style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--taupe);">Scenic</span>
            <span style="font-size: 0.7rem; color: var(--taupe); margin-top: 0.5rem; letter-spacing: 0.1em;">Oil on linen</span>
          </div>
        </div>
      </div>
    </section>

    <section id="about">
      <div class="about-section">
        <div class="about-image">
          <img src="https://media.drewaltizer.com/2126-MATCHESFASHION-COM-celebrates-Aquazzura-for-De-Gournay-exclusive-collection-launch/59bb6edad4380-0101-Matches-170501-min.jpg"
               alt="Daniel Schneider-Weiler"
               style="object-position: center 20%;">
        </div>
        <div class="about-content">
          <h2>About the Artist</h2>
          <p>
            With over two decades dedicated to the art of hand painted wallpaper,
            Daniel Schneider-Weiler brings an unparalleled mastery of traditional techniques
            to contemporary interior design.
          </p>
          <p>
            Each commission begins with a personal consultation, where your vision
            is translated into a bespoke work of art. From delicate chinoiserie to
            bold botanical studies, every brushstroke is executed with precision
            and passion.
          </p>
          <p>
            Based in Los Angeles, Daniel works with discerning clients worldwide
            to create wallpapers that transform spaces into extraordinary environments.
          </p>
          <a href="#book" class="btn" style="margin-top: 1rem;">Begin Your Commission</a>
        </div>
      </div>
    </section>

    <section id="book" class="booking-section">
      <h2 class="section-title">Book a Consultation</h2>
      <p class="section-subtitle">In-Person Appointments Available</p>
      <form class="booking-form" action="/api/book" method="POST">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" required>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" required>
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="date">Preferred Date</label>
            <input type="date" id="date" name="date" required>
          </div>
          <div class="form-group">
            <label for="time">Preferred Time</label>
            <select id="time" name="time" required>
              <option value="">Select a time</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="projectType">Project Type</label>
          <select id="projectType" name="projectType">
            <option value="">Select project type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="hospitality">Hospitality</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label for="message">Tell us about your project</label>
          <textarea id="message" name="message" rows="4"></textarea>
        </div>
        <button type="submit" class="btn" style="width: 100%;">Request Appointment</button>
      </form>
    </section>

    <section id="contact">
      <h2 class="section-title">Visit the Studio</h2>
      <p class="section-subtitle">By Appointment Only</p>
      <div style="text-align: center; color: var(--taupe);">
        <p style="margin-bottom: 0.5rem;">Los Angeles, California</p>
        <p style="margin-bottom: 2rem;">studio@dswwallpaper.com</p>
      </div>
    </section>

    <footer>
      <span class="logo">Daniel Schneider-Weiler</span>
      <p>&copy; ${new Date().getFullYear()} All Rights Reserved</p>
    </footer>
  `);

  return c.html(html);
});

// Booking confirmation page
app.get('/thank-you', (c) => {
  const html = layout(`
    <nav>
      <a href="/" class="logo">DSW</a>
      <div class="nav-links">
        <a href="/#portfolio">Portfolio</a>
        <a href="/#about">About</a>
        <a href="/#book">Book Consultation</a>
        <a href="/#contact">Contact</a>
      </div>
    </nav>

    <section class="hero" style="height: 80vh;">
      <div class="hero-content">
        <h1>Thank You</h1>
        <p class="tagline">Your consultation request has been received</p>
        <p style="color: var(--taupe); margin-bottom: 2rem; max-width: 500px;">
          We will review your request and contact you within 24 hours to confirm your appointment.
        </p>
        <a href="/" class="btn">Return Home</a>
      </div>
    </section>

    <footer>
      <span class="logo">Daniel Schneider-Weiler</span>
      <p>&copy; ${new Date().getFullYear()} All Rights Reserved</p>
    </footer>
  `, 'Thank You | Daniel Schneider-Weiler');

  return c.html(html);
});

// API: Book appointment
app.post('/api/book', async (c) => {
  try {
    const formData = await c.req.formData();

    const booking = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      projectType: formData.get('projectType') as string || null,
      message: formData.get('message') as string || null,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store in D1 if available
    if (c.env?.DB) {
      await c.env.DB.prepare(`
        INSERT INTO appointments (first_name, last_name, email, phone, date, time, project_type, message, created_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        booking.firstName,
        booking.lastName,
        booking.email,
        booking.phone,
        booking.date,
        booking.time,
        booking.projectType,
        booking.message,
        booking.createdAt,
        booking.status
      ).run();
    }

    // Redirect to thank you page
    return c.redirect('/thank-you');
  } catch (error) {
    return c.text('Error processing booking', 500);
  }
});

// API: Get all appointments (CRM)
app.get('/api/appointments', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'Database not configured' }, 500);
  }

  const { results } = await c.env.DB.prepare(`
    SELECT * FROM appointments ORDER BY date DESC, time DESC
  `).all();

  return c.json(results);
});

// API: Update appointment status
app.patch('/api/appointments/:id', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'Database not configured' }, 500);
  }

  const id = c.req.param('id');
  const { status } = await c.req.json();

  await c.env.DB.prepare(`
    UPDATE appointments SET status = ? WHERE id = ?
  `).bind(status, id).run();

  return c.json({ success: true });
});

// CRM Dashboard
app.get('/admin', async (c) => {
  const html = layout(`
    <nav>
      <a href="/" class="logo">DSW Admin</a>
      <div class="nav-links">
        <a href="/">View Site</a>
      </div>
    </nav>

    <section style="padding-top: 10rem;">
      <h2 class="section-title">Appointments</h2>
      <p class="section-subtitle">Client Management</p>

      <div id="appointments" style="max-width: 1000px; margin: 0 auto;">
        <p style="text-align: center; color: var(--taupe);">Loading appointments...</p>
      </div>
    </section>

    <script>
      async function loadAppointments() {
        try {
          const res = await fetch('/api/appointments');
          const data = await res.json();

          if (data.error) {
            document.getElementById('appointments').innerHTML = '<p style="text-align: center; color: var(--taupe);">Database not configured. Appointments will be stored once D1 is set up.</p>';
            return;
          }

          if (data.length === 0) {
            document.getElementById('appointments').innerHTML = '<p style="text-align: center; color: var(--taupe);">No appointments yet.</p>';
            return;
          }

          const html = data.map(apt => \`
            <div style="background: var(--cream); padding: 2rem; margin-bottom: 1rem; display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 2rem; align-items: center;">
              <div>
                <strong>\${apt.first_name} \${apt.last_name}</strong><br>
                <span style="color: var(--taupe); font-size: 0.85rem;">\${apt.email}</span>
                \${apt.phone ? '<br><span style="color: var(--taupe); font-size: 0.85rem;">' + apt.phone + '</span>' : ''}
              </div>
              <div>
                <span style="font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--taupe);">Appointment</span><br>
                \${apt.date} at \${apt.time}
              </div>
              <div>
                <span style="font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--taupe);">Project</span><br>
                \${apt.project_type || 'Not specified'}
              </div>
              <div>
                <select onchange="updateStatus(\${apt.id}, this.value)" style="padding: 0.5rem; border: 1px solid var(--taupe);">
                  <option value="pending" \${apt.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="confirmed" \${apt.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                  <option value="completed" \${apt.status === 'completed' ? 'selected' : ''}>Completed</option>
                  <option value="cancelled" \${apt.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </div>
            </div>
          \`).join('');

          document.getElementById('appointments').innerHTML = html;
        } catch (err) {
          document.getElementById('appointments').innerHTML = '<p style="text-align: center; color: var(--taupe);">Error loading appointments.</p>';
        }
      }

      async function updateStatus(id, status) {
        await fetch('/api/appointments/' + id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
      }

      loadAppointments();
    </script>

    <footer>
      <span class="logo">Daniel Schneider-Weiler</span>
      <p>&copy; ${new Date().getFullYear()} All Rights Reserved</p>
    </footer>
  `, 'Admin | Daniel Schneider-Weiler');

  return c.html(html);
});

export default app;
