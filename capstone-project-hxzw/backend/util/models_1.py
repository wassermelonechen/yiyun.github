from app import api
from flask_restplus import fields

token_details = api.model('token_details',{
    'token': fields.String()
})

classtable_details = api.model('classtable_details', {
  'class_id': fields.String(required=True, example='COMP9900'),
})

consultation_details = api.model('consultation_details',{
  'consultation_id': fields.String(required=True,example = '0'),
  'consultation_time': fields.String(required=True,example = 'Tuesday'),
})

login_details = api.model('login_details', {
  'student_id': fields.String(required=True, example='z5102636'),
  'password': fields.String(required=True, example='12'),
})

signup_details = api.model('signup_details', {
  'student_id': fields.String(required=True, example='z123456'),
  'password': fields.String(required=True, example='123456'),
  'username':  fields.String(required=True, example='lunana'),
  'upcoming': fields.String(),
  'class_id': fields.String(required=True, example='COMP9900;COMP9044'),
  'tutor': fields.String(required=True, example='0')
})


comment_details = api.model('comment_details', {
  'comment': fields.String(required=True, example='Good Question!'),
})

comment_details_vote = api.model('comment_details_vote', {
  'comment_vote':fields.String(required=True, example='z5102636')
})

comment_details_vote_bad=api.model('comment_details_vote_bad', {
  'comment_vote_bad':fields.String(required=True, example='z5102636')
})

post_meta_details = api.model('post_meta_details',{
    "forum_time": fields.String(), 
    "forum_vote": fields.String(),
    "forum_student_id": fields.String(),
    "forum_class": fields.String(),
    "forum_tag": fields.String(),
    "comments": fields.List(fields.Nested(comment_details))
})



post_details = api.model('post_details', {
  "forum_id": fields.Integer(),
  "forum_body": fields.String(),
  "forum_title": fields.String(),
  "meta": fields.Nested(post_meta_details),
})

post_list_details = api.model('post_list_details',{
    "forum" : fields.List(fields.Nested(post_details))
})

post_id_details = api.model('post_id_details',{
    "forum_id": fields.String()
})

auth_details = api.parser().add_argument('Authorization', help="Your Authorization Token in the form 'Token <AUTH_TOKEN>'",location='headers')

update_post_details = api.model('update_post_details',{
  "title": fields.String(required=True, example='My favourite Lad'),
  "text": fields.String(required=True, example='i had a fun time!')
})

new_post_details = api.model('new_post_details',{
  "title": fields.String(required=True, example='What is machine learning'),
  "text": fields.String(required=True, example='I cannot find it'),
  "subseddit": fields.String(required=True, example='Machine learning'),
  "class_id": fields.String(required=True, example='COMP9900')
})

upcoming_details = api.model('upcoming_details', {
  'upcoming': fields.String(example='Monday 5pm-7pm')
})

class_details = api.model('class_details', {
  'class': fields.String(example='comp9044')
})

user_details = api.model('user_details', {
  "student_id": fields.String(example='z5102636'),
  "username": fields.String(example='luna'),
  "password": fields.String(example='12'),
  "upcoming": fields.List(fields.Nested(upcoming_details)),
  "class_id": fields.List(fields.Nested(class_details)),
})

user_update_details = api.model('user_update_details', {
    'username':  fields.String(example='greg'),
    'password': fields.String(example='1234')
})





