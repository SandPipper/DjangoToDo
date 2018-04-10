def get_or_none(model, **kwargs):
    '''
    Retreive single object from database or None.
    :param model: Django model
    :param kwargs: Request filters.
    :return:
    '''
    try:
      return model.objects.get(**kwargs)
    except model.DoesNotExist:
      return
