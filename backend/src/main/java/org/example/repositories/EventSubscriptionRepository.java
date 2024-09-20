package org.example.repositories;

import org.example.models.events.*;
import org.example.models.subscriptions.*;
import org.example.models.user.*;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventSubscriptionRepository extends JpaRepository<EventSubscription, Long> {
    List<EventSubscription> findAllByUser(User user);
}
