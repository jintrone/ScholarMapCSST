<%@ page import="csst15.constants.EntityType" %>
<div class="form-group">
    <g:select from="${EntityType.values()}" noSelection="['': 'Not set']"
              class="form-control" value="${command?.type}" name="type" placeholder="Type"/>
</div>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" name="name" value="${command?.name}" class="form-control" id="name"
           placeholder="Not set">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea name="description" rows="10" id="description" class="form-control"
              placeholder="Not set">${command?.description}</textarea>
</div>
<button type="submit" class="btn btn-primary">Submit</button>
