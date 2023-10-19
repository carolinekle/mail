document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_mail);
  // By default, load the inbox
  load_mailbox('inbox');

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function reply_email(id){
  console.log(`${id} is listening `)
}

function view_email(id) {
  console.log(id)
  container = document.querySelector('.container')
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';

      view = document.createElement('div')
      view.setAttribute('id','single-view')
      container.appendChild(view)

      emailView = document.createElement("div")
      emailView.classList.add('jumbotron')
      view.appendChild(emailView)

      emailSubject = document.createElement('h6')
      emailSubject.classList.add('display-4')
      emailSubject.innerHTML = `${email.subject}`
      emailView.appendChild(emailSubject)

      sender = document.createElement('small')
      sender.innerHTML = `${email.sender}`
      emailView.appendChild(sender)

      breakSender = document.createElement('br')
      emailView.appendChild(breakSender)

      time = document.createElement('small')
      time.classList.add('my-4')
      time.innerHTML = `${email.timestamp}`
      emailView.appendChild(time)

      lineBreak = document.createElement('hr')
      lineBreak.classList.add('my-4')
      emailView.appendChild(lineBreak)

      emailBody = document.createElement('p')
      emailBody.classList.add('lead')
      emailBody.innerHTML = `${email.body}`
      emailView.appendChild(emailBody)

      reply = document.createElement('button')
      reply.classList.add('btn', 'btn-primary','mr-3')
      reply.innerHTML = 'Reply'
      view.appendChild(reply)
      reply.addEventListener('click', () => reply_email(email.id));

      archive = document.createElement('button')
      archive.classList.add('btn', 'btn-secondary')
      view.appendChild(archive)
      archive.addEventListener('click', function() {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            archived: !email.archived
          })
        })
        .then(response => response.json())  // Wait for the response from the server
        .then(email => {
          // Update the button label based on the updated email's archived status

          document.querySelector('.btn-secondary').innerHTML = email.archived ? "Unarchive" : "Archive";
        });
      });
      
  });

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  
  }

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  const singleView = document.querySelector('#single-view');
  if (singleView) {
    singleView.style.display = 'none';
  }
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
    all_emails=document.createElement('div')
    all_emails.classList.add('list-group')
    document.querySelector('#emails-view').appendChild(all_emails)
    
    emails.forEach((email) => {
      holder = document.createElement('a')
      holder.classList.add('list-group-item','list-group-item-action', 'flex-column', 'align-items-start')
      holder.addEventListener('click', () => view_email(email.id));

      preview = document.createElement('div');
      preview.classList.add('d-flex', 'w-100', 'justify-content-between')
      holder.appendChild(preview)

      email_subject = document.createElement('h6');
      email_subject.classList.add('mb-1')
      email_subject.innerHTML=`${email.subject}`
      preview.appendChild(email_subject)

      time = document.createElement('small')
      time.innerHTML=`${email.timestamp}`
      preview.appendChild(time)

      text = document.createElement('p');
      if (email.body.length > 100) {
        text.textContent = `${email.body.substring(0, 120)}...`;
      } else {
        text.textContent = `${email.body}`;
      }

      holder.appendChild(text)
      sender = document.createElement('small');
      sender.classList.add('text-muted')
      sender.innerHTML = `${email.sender}`
      holder.appendChild(sender)

      all_emails.appendChild(holder)
      
      if (email.read === true) {
        holder.classList.add('bg-secondary', 'text-white');
        sender.classList.add('text-white');
        sender.classList.remove('text-muted');
      } else {
        holder.classList.add('bg-light', 'text-dark');
      }
    
    }) 
});
}

function send_mail(event){
  recipients=document.querySelector('#compose-recipients').value
  subject=document.querySelector('#compose-subject').value
  body=document.querySelector('#compose-body').value
  event.preventDefault();
   fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox(sent)
  });

}

