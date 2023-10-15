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

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
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
      text.classList.add('mb-1')
      text.innerHTML = `${email.body}`
      holder.appendChild(text)

      sender = document.createElement('small');
      sender.classList.add('text-muted')
      sender.innerHTML = `${email.sender}`
      holder.appendChild(sender)

      all_emails.appendChild(holder)
      
      email.read === true ? holder.classList.add('bg-secondary', 'text-white') : holder.classList.add('bg-light', 'text-dark');
    
    }) 
});
}

function send_mail(event){
  console.log("boo!");
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
