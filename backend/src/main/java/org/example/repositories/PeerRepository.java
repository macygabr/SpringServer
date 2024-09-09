package org.example.repositories;

import java.util.Optional;

import org.example.models.Peer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeerRepository extends JpaRepository<Peer, Long> {
    Optional<Peer> findByNickName(String nickName);
}